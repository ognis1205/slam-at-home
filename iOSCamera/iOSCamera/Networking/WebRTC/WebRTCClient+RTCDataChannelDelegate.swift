//
//  WebRTCClient+RTCDataChannelDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/26.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

extension WebRTCClient: RTCDataChannelDelegate {
  // MARK: Methods

  func dataChannelDidChangeState(
    _ dataChannel: RTCDataChannel
  ) {
    self.info("dataChannel did change state: \(dataChannel.readyState)...")
  }
    
  func dataChannel(
    _ dataChannel: RTCDataChannel,
    didReceiveMessageWith buffer: RTCDataBuffer
  ) {
    self.info("dataChannel did recieve message...")
    self.delegate?.webRTC(self, didReceiveData: buffer.data)
  }
}
