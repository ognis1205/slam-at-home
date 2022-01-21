//
//  VideoCapturing.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/19.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import AVFoundation

public enum VideoSetupResult {
  case success
  case notAuthorized
  case configurationFailed
}

public protocol VideoCapturing: AVCaptureVideoDataOutputSampleBufferDelegate, AlertReporting {
  var videoSetupResult: VideoSetupResult { get set }

  var videoSession: AVCaptureSession { get set }

  var videoOutput: AVCaptureVideoDataOutput { get set }
  
  var videoQueue: DispatchQueue { get set }

  var isVideoCapturing: Bool

  func startVideoSession() -> Void
}

private extension VideoCapturing {
  func checkPermissions() -> Void {
    debugPrint("Checking video capture session permissions")
    switch AVCaptureDevice.authorizationStatus(for: .video) {
      case .authorized:
        break
      case .notDetermined:
        AVCaptureDevice.requestAccess(for: .video, completionHandler: { granted in
          if !granted self.videoSetupResult = .notAuthorized
        })
      default:
        self.videoSetupResult = .notAuthorized
        self.reportAlert(
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
    }
  }

  public func commitConfigurations() -> Void {
    debugPrint("Checking video setup result")
    if self.videoSetupResult != .success { return }

    debugPrint("Configuring video device")
    self.videoSession.beginConfiguration()
    self.videoSession.sessionPreset = .medium

    do {
      var defaultDevice: AVCaptureDevice?
      if let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) {
        defaultDevice = backCamera
      } else if let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) {
        defaultDevice = frontCamera
      }

      guard let videoDevice = defaultDevice else {
        debugPrint("Default video device is unavailable")
        self.videoSetupResult = .configurationFailed
        self.videoSession.commitConfiguration()
        return
      }

      try videoDevice.lockForConfiguration()
      videoDevice.focusMode = .continuousAutoFocus
      videoDevice.unlockForConfiguration()
      let videoDeviceInput = try AVCaptureDeviceInput(device: videoDevice)

      if self.videoSession.canAddInput(videoDeviceInput) {
        self.videoOutput.setSampleBufferDelegate(self, queue: avQueue)
        self.videoSession.addInput(videoDeviceInput)
        self.videoSession.addOutput(self.avOutput)
      } else {
        debugPrint("Could not add video device input to the session")
        self.videoSetupResult = .configurationFailed
        self.videoSession.commitConfiguration()
        return
      }
    } catch {
      debugPrint("Could not create video device input")
      self.videoSetupResult = .configurationFailed
    }

    self.videoSession.commitConfiguration()
  }
}

public extension VideoCapturing {
  public func startVideoSession() -> Void {
    self.checkPermissions()
    self.commitConfigurations()    
    debugPrint("Starting video session")
    if !self.isVideoCapturing {
      switch self.videoSetupResult {
        case .success:
          self.videoSession.startRunning()
          self.isVideoCapturing = self.videoSession.isRunning
        case .configurationFailed, .notAuthorized:
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
