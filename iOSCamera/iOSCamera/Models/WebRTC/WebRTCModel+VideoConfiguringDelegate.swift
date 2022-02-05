//
//  WebRTCModel+VideoConfiguringDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/05.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCModel: VideoConfiguringDelegate {
  func willConfigure() {
    // Do nothing.
  }

  func didNotFindDevice() {
    // Do nothing.
  }

  func didFindDevice(_ device: AVCaptureDevice) throws {
    try device.lockForConfiguration()
    device.focusMode = .continuousAutoFocus
    device.unlockForConfiguration()
    self.capture.device = device
  }
  
  func didConfigure() {
    // Do nothing.
  }
}
