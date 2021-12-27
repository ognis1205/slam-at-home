//
//  StreamingService.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import AVFoundation
import CocoaAsyncSocket

private enum SessionSetupResult {
  case success
  case notAuthorized
  case configurationFailed
}

public class StreamingService: NSObject {
  /// The service port number.
  public static let PORT: UInt16 = 10001

  /// $Observable state of URL.
  @Published public var URL = ""

  /// $Observable state of alert flag.
  @Published public var shouldShowAlertView = false

  /// $Observable state of camera availability.
  @Published public var isCameraUnavailable = true

  /// $Observable state of socket availability.
  @Published public var isSocketUnavailable = true

  /// The session so that the video preview layer can output what the camera is capturing.
  public let avCaptureSession = AVCaptureSession()

  /// Reference to the current alert.
  public var alert: Alert = Alert()

  /// Stores the result of the setup process.
  fileprivate var setupResult: SessionSetupResult = .success
  
  /// The IP address of this device.
  fileprivate let ip = IP.getAddress()

  /// The server socket.
  fileprivate var socket: GCDAsyncSocket?

  /// The active sessions between clients.
  fileprivate var connections = [Int: Connection]()

  /// The session GDC queue: AVCaptureSession
  fileprivate let sessionQueue = DispatchQueue(
    label: "session queue",
    attributes: [])

  /// The socket listening GDC queue.
  fileprivate let socketListenQueue = DispatchQueue(
    label: "socket listen queue",
    attributes: [])

  /// The socket write GDC queue.
  fileprivate let socketWriteQueue = DispatchQueue(
    label: "socket write queue",
    attributes: .concurrent)

  /// The connection GDC queue.
  fileprivate let connectionQueue = DispatchQueue(
    label: "connection queue",
    attributes: .concurrent)
  
  /// Reference to the camera device.
  @objc dynamic fileprivate var avDeviceInput: AVCaptureDeviceInput!
  
  /// Reference to the video device.
  fileprivate let avDeviceOutput = AVCaptureVideoDataOutput()
  
  /// Reference to the CI context.
  fileprivate let context = CIContext(options: nil)

  /// Reference to the video device discovery session.
  fileprivate let avDiscoverySession = AVCaptureDevice.DiscoverySession(
    deviceTypes: [.builtInWideAngleCamera, .builtInDualCamera, .builtInTrueDepthCamera],
    mediaType: .video,
    position: .unspecified)
  
  /// Configuration flag.
  fileprivate var isConfigured = false

  /// Session start flag.
  fileprivate var isSessionRunning = false
  
  /// Server start flag.
  fileprivate var isSocketListening = false

  /// Checks for user's permissions
  public func checkPermissions() {
    print("Checking AV permissions for [\(String(describing: self.ip))]")
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
          self.alert = Alert(
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
          self.shouldShowAlertView = true
          self.isCameraUnavailable = true
        }
    }
  }

  /// Configures the device and session.
  public func start() {
    self.sessionQueue.async {
      self.setupAndStart()
    }
  }

  /// Configures the device and the session.
  private func setupAndStart() {
    print("Checking setup result for [\(String(describing: self.ip))]")
    if setupResult != .success { return }

    print("Configuring video device for [\(String(describing: self.ip))]")
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
        print("Default video device is unavailable for [\(String(describing: self.ip))]")
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
        print("Could not add video device input to the session for [\(String(describing: self.ip))]")
        self.setupResult = .configurationFailed
        self.avCaptureSession.commitConfiguration()
        return
      }
    } catch {
      print("Could not create video device input for [\(String(describing: self.ip))]: \(error)")
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
  private func startSession() {
    print("Starting AV session for [\(String(describing: self.ip))]")
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
          print("Application not authorized to use camera for [\(String(describing: self.ip))]")
          DispatchQueue.main.async {
            self.alert = Alert(
              title: "Camera Error",
              message: "Camera configuration failed. Either your device camera is not available or its missing permissions",
              primaryButtonTitle: "Accept",
              secondaryButtonTitle: nil,
              primaryAction: nil,
              secondaryAction: nil)
            self.shouldShowAlertView = true
            self.isCameraUnavailable = true
          }
      }
    }
  }

  /// Start listening on socket.
  private func startListening() {
    print("Creating service for [\(String(describing: self.ip))]")
    if !self.isSocketListening && self.isSessionRunning && self.isConfigured {
      self.socket = GCDAsyncSocket(
        delegate: self,
        delegateQueue: self.socketListenQueue,
        socketQueue: self.socketWriteQueue)
      do {
        try self.socket?.accept(onInterface: self.ip, port: StreamingService.PORT)
      } catch {
        print("Could not start listening on port \(StreamingService.PORT) (\(error))")
        DispatchQueue.main.async {
          self.alert = Alert(
            title: "Socket Error",
            message: "Start listening socket failed. Either port number is not available or its missing permissions",
            primaryButtonTitle: "Accept",
            secondaryButtonTitle: nil,
            primaryAction: nil,
            secondaryAction: nil)
          self.shouldShowAlertView = true
          self.isSocketUnavailable = true
        }
        return
      }
      self.isSocketListening = true
      DispatchQueue.main.async {
        self.isSocketUnavailable = false
        if let ip = self.ip {
          self.URL = "http://\(ip):10001"
        } else {
          self.URL = "IP address not available"
        }
        // Camera view addGestureRecognizer here?
      }
    }
  }
}

extension StreamingService: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(
    _ output: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from connection: AVCaptureConnection
  ) {
    if !self.connections.isEmpty {
      guard let buffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
      let capturedImage = CIImage(cvImageBuffer: buffer, options: nil)
      guard let image = self.context.createCGImage(capturedImage, from: capturedImage.extent) else { return }
      let jpeg = UIImage(cgImage: image).jpegData(compressionQuality: 0)

      for (key, connection) in self.connections {
        if connection.isConnected {
          connection.dataToSend = (jpeg as NSData?)?.copy() as? Data
        } else {
          self.connections.removeValue(forKey: key)
        }
      }

      if self.connections.isEmpty {
        DispatchQueue.main.async(execute: {
          // LED GRAY
        })
      }
    }
  }
}

extension StreamingService: GCDAsyncSocketDelegate {
  public func socket(_ sock: GCDAsyncSocket, didAcceptNewSocket newSocket: GCDAsyncSocket) {
    print("New connection from IP [\(newSocket.connectedHost ?? "unknown")]")
    guard let id = newSocket.connectedAddress?.hashValue else { return }
    let newConnection = Connection(
      id: id,
      socket: newSocket,
      dispatchQueue: self.connectionQueue)
    self.connections[id] = newConnection
    newConnection.open()
    DispatchQueue.main.async(execute: {
      // LED Image RED.
    })
  }
}
