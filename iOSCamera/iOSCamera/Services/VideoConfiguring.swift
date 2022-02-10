//
//  VideoConfigurabling.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/03.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import CoreImage
import Foundation

enum VideoConfigureState {
  case ready
  case authorized
  case notAuthorized
  case configured
  case configurationFailed
  case running
}

enum VideoConfigureError: Error {
  case creationFailed
}

protocol VideoConfiguringDelegate: AnyObject {
  // MARK: Methods

  func willConfigure()
  
  func didNotFindDevice()
  
  func didFindDevice(_ device: AVCaptureDevice) throws
  
  func didConfigure()
}

class VideoConfigure: Debuggable {
  // MARK: Properties

  var state: VideoConfigureState

  // MARK: Init

  init(state: VideoConfigureState) {
    self.state = state
  }
  
  // MARK: Methods
  
  func state(_ state: VideoConfigureState) {
    self.state = state
  }
  
  func configure(_ delegate: VideoConfiguringDelegate) {
    self.info("configure video device...")
    if self.state != .authorized {
      return
    } else {
      delegate.willConfigure()
    }

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
        self.warn("video device is unavailable...")
        self.state(.configurationFailed)
        delegate.didNotFindDevice()
        return
      }
      try delegate.didFindDevice(videoDevice)
    } catch {
      self.warn("could not create video device input...")
      self.state(.configurationFailed)
      return
    }

    self.state(.configured)
    delegate.didConfigure()
  }
}

protocol VideoConfiguring: AlertReporting, Debuggable {
  // MARK: Methods

  func configure(
    _ configure: VideoConfigure,
    configure: VideoConfiguringDelegate,
    alert: AlertReportingDelegate)
}

private extension VideoConfiguring {
  // MARK: Methods

  func checkPermissions(_ configure: VideoConfigure, delegate: AlertReportingDelegate) {
    self.info("checkPermissions of video device...")
    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      configure.state(.authorized)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video, completionHandler: { granted in
        if !granted {
          configure.state(.notAuthorized)
          return
        }
      })
      configure.state(.authorized)
    default:
      configure.state(.notAuthorized)
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

extension VideoConfiguring {
  // MARK: Methods

  func configure(
    _ video: VideoConfigure,
    configure: VideoConfiguringDelegate,
    alert: AlertReportingDelegate) {
    self.checkPermissions(video, delegate: alert)
    video.configure(configure)
  }
}
