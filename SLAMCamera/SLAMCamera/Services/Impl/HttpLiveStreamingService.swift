//
//  HttpLiveStreamingService.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import AVFoundation
import CocoaAsyncSocket

public class HttpLiveStreamingService: NSObject, StreamingService {
  /// The service port number.
  public static let PORT: UInt16 = 10001

  /// $Observable state of URL.
  @Published public var URL: String = ""
  public var URLPublisher: Published<String>.Publisher {
    $URL
  }

  /// $Observable state of alert flag.
  @Published public var shouldShowAlert: Bool = false
  public var shouldShowAlertPublisher: Published<Bool>.Publisher {
    $shouldShowAlert
  }

  /// $Observable state of socket listening state.
  @Published public var isConnected: Bool = false
  public var isConnectedPublisher: Published<Bool>.Publisher {
    $isConnected
  }

  /// $Observable state of camera availability.
  @Published public var isCameraUnavailable: Bool = true
  public var isCameraUnavailablePublisher: Published<Bool>.Publisher {
    $isCameraUnavailable
  }

  /// $Observable state of socket availability.
  @Published public var isSocketUnavailable: Bool = true
  public var isSocketUnavailablePublisher: Published<Bool>.Publisher {
    $isSocketUnavailable
  }

  /// The session so that the video preview layer can output what the camera is capturing.
  public var avCaptureSession: AVCaptureSession = AVCaptureSession()

  /// Reference to the current alert.
  public var alert: AlertModel = AlertModel()

  /// Stores the result of the setup process.
  private(set) var setupResult: SessionSetupResult = .success

  /// The active sessions between clients.
  internal var connections: [Int: HttpLiveStreaming] = [Int: HttpLiveStreaming]()

  /// The session GDC queue: AVCaptureSession
  internal let sessionQueue: DispatchQueue = DispatchQueue(
    label: "session queue",
    attributes: [])

  /// The socket listening GDC queue.
  internal let socketListenQueue: DispatchQueue = DispatchQueue(
    label: "socket listen queue",
    attributes: [])

  /// The socket write GDC queue.
  internal let socketWriteQueue: DispatchQueue = DispatchQueue(
    label: "socket write queue",
    attributes: .concurrent)

  /// The connection GDC queue.
  internal let connectionQueue: DispatchQueue = DispatchQueue(
    label: "connection queue",
    attributes: .concurrent)

  /// Reference to the CI context.
  internal let context: CIContext = CIContext(options: nil)

  /// The IP address of this device.
  private let ip: String? = IP.getAddress()

  /// The server socket.
  private var server: GCDAsyncSocket?
  
  /// Reference to the camera device.
  @objc dynamic private var avDeviceInput: AVCaptureDeviceInput!
  
  /// Reference to the video device.
  private let avDeviceOutput: AVCaptureVideoDataOutput = AVCaptureVideoDataOutput()

  /// Reference to the video device discovery session.
  private let avDiscoverySession: AVCaptureDevice.DiscoverySession = AVCaptureDevice.DiscoverySession(
    deviceTypes: [.builtInWideAngleCamera, .builtInDualCamera, .builtInTrueDepthCamera],
    mediaType: .video,
    position: .unspecified)
  
  /// Configuration flag.
  private var isConfigured: Bool = false

  /// Session start flag.
  private var isSessionRunning: Bool = false
  
  /// Server start flag.
  private var isSocketListening: Bool = false

  /// Checks for user's permissions
  public func checkPermissions() -> Void {
    debugPrint("Checking AV permissions")
    switch AVCaptureDevice.authorizationStatus(for: .video) {
      case .authorized:
        break
      case .notDetermined:
        self.sessionQueue.suspend()
        AVCaptureDevice.requestAccess(for: .video, completionHandler: { granted in
          if !granted {
            self.setupResult = .notAuthorized
          }
          self.sessionQueue.resume()
        })
      default:
        self.setupResult = .notAuthorized
        DispatchQueue.main.async {
          self.alert = AlertModel(
            title: "Camera Access",
            message: "SLAMCamera doesn't have access to use your camera, please update your privacy settings.",
            primaryButtonTitle: "Settings",
            secondaryButtonTitle: nil,
            primaryAction: {
              UIApplication.shared.open(
                Foundation.URL(string: UIApplication.openSettingsURLString)!,
                options: [:],
                completionHandler: nil)
            },
            secondaryAction: nil)
          self.shouldShowAlert = true
          self.isCameraUnavailable = true
        }
    }
  }

  /// Configures the device and the session.
  public func start() -> Void {
    debugPrint("Checking setup result")
    if setupResult != .success { return }

    debugPrint("Configuring video device")
    self.avCaptureSession.beginConfiguration()
    self.avCaptureSession.sessionPreset = .medium

    do {
      var defaultDevice: AVCaptureDevice?
      if let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) {
        defaultDevice = backCamera
      } else if let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) {
        defaultDevice = frontCamera
      }

      guard let videoDevice = defaultDevice else {
        debugPrint("Default video device is unavailable")
        self.setupResult = .configurationFailed
        self.avCaptureSession.commitConfiguration()
        return
      }

      try videoDevice.lockForConfiguration()
      videoDevice.focusMode = .continuousAutoFocus
      videoDevice.unlockForConfiguration()
      let videoDeviceInput = try AVCaptureDeviceInput(device: videoDevice)

      if avCaptureSession.canAddInput(videoDeviceInput) {
        self.avDeviceInput = videoDeviceInput
        self.avDeviceOutput.setSampleBufferDelegate(self, queue: sessionQueue)
        self.avCaptureSession.addInput(self.avDeviceInput)
        self.avCaptureSession.addOutput(self.avDeviceOutput)
      } else {
        debugPrint("Could not add video device input to the session")
        self.setupResult = .configurationFailed
        self.avCaptureSession.commitConfiguration()
        return
      }
    } catch {
      debugPrint("Could not create video device input")
      self.setupResult = .configurationFailed
      self.avCaptureSession.commitConfiguration()
      return
    }

    self.avCaptureSession.commitConfiguration()
    self.isConfigured = true
    self.startSession()
    self.startListening()
  }

  /// Start AVCaputureSession.
  private func startSession() -> Void {
    debugPrint("Starting AV session")
    if !self.isSessionRunning && self.isConfigured {
      switch self.setupResult {
        case .success:
          self.avCaptureSession.startRunning()
          self.isSessionRunning = self.avCaptureSession.isRunning
          if self.avCaptureSession.isRunning {
            DispatchQueue.main.async {
              self.isCameraUnavailable = false
            }
          }
        case .configurationFailed, .notAuthorized:
          debugPrint("Application not authorized to use camera")
          DispatchQueue.main.async {
            self.alert = AlertModel(
              title: "Camera Error",
              message: "Camera configuration failed. Either your device camera is not available or its missing permissions",
              primaryButtonTitle: "Accept",
              secondaryButtonTitle: nil,
              primaryAction: nil,
              secondaryAction: nil)
            self.shouldShowAlert = true
            self.isCameraUnavailable = true
          }
      }
    }
  }

  /// Start listening on socket.
  private func startListening() -> Void {
    debugPrint("Starting service on \(String(describing: self.ip!)):\(HttpLiveStreamingService.PORT)")
    if !self.isSocketListening && self.isSessionRunning && self.isConfigured {
      self.server = GCDAsyncSocket(
        delegate: self,
        delegateQueue: self.socketListenQueue,
        socketQueue: self.socketWriteQueue)
      do {
        try self.server?.accept(onInterface: self.ip, port: HttpLiveStreamingService.PORT)
      } catch {
        debugPrint("Could not start listening on port \(HttpLiveStreamingService.PORT) (\(error))")
        DispatchQueue.main.async {
          self.alert = AlertModel(
            title: "Socket Error",
            message: "Start listening socket failed. Either port number is not available or its missing permissions",
            primaryButtonTitle: "Accept",
            secondaryButtonTitle: nil,
            primaryAction: nil,
            secondaryAction: nil)
          self.shouldShowAlert = true
          self.isSocketUnavailable = true
        }
        return
      }
      DispatchQueue.main.async {
        self.isSocketUnavailable = false
        self.isSocketListening = true
        if let ip = self.ip {
          self.URL = "http://\(ip):10001"
        } else {
          self.URL = "IP address not available"
        }
      }
    }
  }
}
