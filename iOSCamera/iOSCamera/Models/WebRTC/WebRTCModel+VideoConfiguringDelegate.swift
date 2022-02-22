//
//  WebRTCModel+VideoConfiguringDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/05.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCModel: VideoConfiguringDelegate {
  // MARK: Methods

  func willConfigure() {
    self.info("will configure...")
  }

  func didNotFindDevice() {
    self.info("did not find device...")
  }

  func didFindDevice(_ device: AVCaptureDevice) throws {
    self.info("did find device...")
    try device.lockForConfiguration()
    device.focusMode = .continuousAutoFocus
    device.unlockForConfiguration()
    self.capture.device = device
    try device.lockForConfiguration()
  }
  
  func didConfigure() {
    self.info("did configure...")
  }
}
