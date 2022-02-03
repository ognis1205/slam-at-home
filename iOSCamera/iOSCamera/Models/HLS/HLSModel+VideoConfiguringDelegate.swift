//
//  HLSModel+VideoConfiguringDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/04.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension HLSModel: VideoConfiguringDelegate {
  func willConfigure() {
    self.capture.session.beginConfiguration()
    self.capture.session.sessionPreset = .medium
  }

  func didNotFindDevice() {
    self.capture.session.commitConfiguration()
  }

  func didFindDevice(_ device: AVCaptureDevice) throws {
    try device.lockForConfiguration()
    device.focusMode = .continuousAutoFocus
    device.unlockForConfiguration()
    let input = try AVCaptureDeviceInput(device: device)
    if self.capture.session.canAddInput(input) {
      self.capture.output.setSampleBufferDelegate(
        self,
        queue: DispatchQueue(
        label: "video",
        attributes: []))
      self.capture.session.addInput(input)
      self.capture.session.addOutput(self.capture.output)
    } else {
      self.capture.state(.configurationFailed)
      self.capture.session.commitConfiguration()
      throw VideoConfigureError.creationFailed
    }
  }
  
  func didConfigure() {
    self.capture.session.commitConfiguration()
  }
}
