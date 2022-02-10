//
//  WebRTCModel+WebRTCClientDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCModel: WebRTCClientDelegate {
  // MARK: Methods

  func webRTC(_ client: WebRTCClient, didDiscoverLocalCandidate candidate: RTCIceCandidate) {
    self.info("webRTC did discover local candidate...")
    self.signal?.send(candidate: candidate)
    self.delegate?.webRTC(didDiscoverLocalCandidate: candidate)
  }
    
  func webRTC(_ client: WebRTCClient, didChangeConnectionState state: RTCIceConnectionState) {
    self.info("webRTC did change connection state...")
    self.delegate?.webRTC(didChangeConnectionState: state)
  }
    
  func webRTC(_ client: WebRTCClient, didReceiveData data: Data) {
    self.info(
      "webRTC did recieve data: \(String(data: data, encoding: .utf8) ?? "(Binary: \(data.count) bytes)")...")
    self.delegate?.webRTC(didReceiveData: data)
  }
}
