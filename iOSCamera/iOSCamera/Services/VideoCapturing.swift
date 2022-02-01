//
//  VideoCapturing.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import CoreImage
import Foundation

enum CaptureState {
  case ready
  case authorized
  case notAuthorized
  case configured
  case configurationFailed
  case running
}

class VideoCapture {
  let session: AVCaptureSession

  let output: AVCaptureVideoDataOutput

  let context: CIContext
  
  var state: CaptureState
  
  init(
    session: AVCaptureSession,
    output: AVCaptureVideoDataOutput,
    context: CIContext,
    state: CaptureState
  ) {
    self.session = session
    self.output = output
    self.context = context
    self.state = state
  }
  
  fileprivate func state(_ state: CaptureState) {
    self.state = state
  }
  
  fileprivate func configure(_ capturing: VideoCapturing) {
    debugPrint("Checking video setup result")
    if self.state != .authorized {
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
        self.state(.configurationFailed)
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
        self.state(.configurationFailed)
        self.session.commitConfiguration()
        return
      }
    } catch {
      debugPrint("Could not create video device input")
      self.state(.configurationFailed)
    }

    debugPrint("Configured video device")
    self.state(.configured)
    self.session.commitConfiguration()
  }
}

protocol VideoCapturing: AVCaptureVideoDataOutputSampleBufferDelegate, AlertReporting {
  func capture(_ capture: VideoCapture, delegate: AlertReportingDelegate)
}

private extension VideoCapturing {
  func checkPermissions(_ capture: VideoCapture, delegate: AlertReportingDelegate) {
    debugPrint("Checking video device permissions")
    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      capture.state(.authorized)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video, completionHandler: { granted in
        if !granted {
          capture.state(.notAuthorized)
          return
        }
      })
      capture.state(.authorized)
    default:
      capture.state(.notAuthorized)
      self.alert(
        delegate,
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

extension VideoCapturing {
  func capture(_ capture: VideoCapture, delegate: AlertReportingDelegate) {
    self.checkPermissions(capture, delegate: delegate)
    capture.configure(self)
    debugPrint("Starting video session")
    switch capture.state {
    case .running:
      break
    case .configured:
      capture.session.startRunning()
      if capture.session.isRunning {
        capture.state(.running)
      }
    default:
      debugPrint("Application not authorized nor configured")
      self.alert(
        delegate,
        title: "Camera Error",
        message: "Camera configuration failed. Either your device camera is not available or its missing permissions",
        primaryButtonTitle: "Accept",
        secondaryButtonTitle: nil,
        primaryAction: nil,
        secondaryAction: nil)
    }
  }
}
