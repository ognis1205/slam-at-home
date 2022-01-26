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
  public func dataChannelDidChangeState(
    _ dataChannel: RTCDataChannel
  ) {
    debugPrint("dataChannel did change state: \(dataChannel.readyState)")
  }
    
  public func dataChannel(
    _ dataChannel: RTCDataChannel,
    didReceiveMessageWith buffer: RTCDataBuffer
  ) {
    self.delegate?.webRTC(self, didReceiveData: buffer.data)
  }
}
