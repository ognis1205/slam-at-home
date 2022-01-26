//
//  VideoCapturing.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import Foundation

public enum VideoSetupResult {
  case ready
  case success
  case notAuthorized
  case configurationFailed
}

public struct VideoCapture {
  public let session: AVCaptureSession

  public let output: AVCaptureVideoDataOutput

  public let context: CIContext
  
  fileprivate func configure(_ capturing: VideoCapturing) {
    debugPrint("Checking video setup result")
    if capturing.videoSetupResult != .success {
      return
    }

    debugPrint("Configuring video device")
    self.session.beginConfiguration()
    self.session.sessionPreset = .medium

    do {
      var defaultDevice: AVCaptureDevice?
      if let backCamera = AVCaptureDevice.default(
        .builtInWideAngleCamera,
        for: .video,
        position: .back) {
        defaultDevice = backCamera
      } else if let frontCamera = AVCaptureDevice.default(
        .builtInWideAngleCamera,
        for: .video,
        position: .front) {
        defaultDevice = frontCamera
      }

      guard let videoDevice = defaultDevice else {
        debugPrint("Default video device is unavailable")
        capturing.videoSetupResult = .configurationFailed
        self.session.commitConfiguration()
        return
      }

      try videoDevice.lockForConfiguration()
      videoDevice.focusMode = .continuousAutoFocus
      videoDevice.unlockForConfiguration()
      let videoDeviceInput = try AVCaptureDeviceInput(device: videoDevice)

      if self.session.canAddInput(videoDeviceInput) {
        self.output.setSampleBufferDelegate(
          capturing,
          queue: DispatchQueue(
            label: "video",
            attributes: []))
        self.session.addInput(videoDeviceInput)
        self.session.addOutput(self.output)
      } else {
        debugPrint("Could not add video device input to the session")
        capturing.videoSetupResult = .configurationFailed
        self.session.commitConfiguration()
        return
      }
    } catch {
      debugPrint("Could not create video device input")
      capturing.videoSetupResult = .configurationFailed
    }

    debugPrint("Configured video device")
    capturing.videoSetupResult = .success
    self.session.commitConfiguration()
  }
}

public protocol VideoCapturing: AVCaptureVideoDataOutputSampleBufferDelegate, AlertReporting {
  var videoSetupResult: VideoSetupResult { get set }

  var isVideoCapturing: Bool { get set }

  func startVideoCapturing(_ capture: VideoCapture)
}

private extension VideoCapturing {
  func checkPermissions() {
    debugPrint("Checking video device permissions")
    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      self.videoSetupResult = .success
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video, completionHandler: { granted in
        if !granted {
          self.videoSetupResult = .notAuthorized
          return
        }
      })
      self.videoSetupResult = .success
    default:
      self.videoSetupResult = .notAuthorized
      self.reportAlert(
        title: "Camera Access",
        message: "iOSCamera doesn't have access to use your camera, please update your privacy settings.",
        primaryButtonTitle: "Settings",
        secondaryButtonTitle: nil,
        primaryAction: {
          guard let URL = Foundation.URL(string: UIApplication.openSettingsURLString) else {
            return
          }
          UIApplication.shared.open(
            URL,
            options: [:],
            completionHandler: nil)
        },
        secondaryAction: nil)
    }
  }
}

public extension VideoCapturing {
  func startVideoCapturing(_ capture: VideoCapture) {
    self.checkPermissions()
    capture.configure(self)
    debugPrint("Starting video session")
    if !self.isVideoCapturing {
      switch self.videoSetupResult {
      case .success:
        capture.session.startRunning()
        self.isVideoCapturing = capture.session.isRunning
      case .ready, .configurationFailed, .notAuthorized:
        debugPrint("Application not authorized to use camera")
        self.reportAlert(
          title: "Camera Error",
          message: "Camera configuration failed. Either your device camera is not available or its missing permissions",
          primaryButtonTitle: "Accept",
          secondaryButtonTitle: nil,
          primaryAction: nil,
          secondaryAction: nil)
      }
    }
  }
}
