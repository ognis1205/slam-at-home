//
//  WebRTCModel+WebRTCClientDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCModel: WebRTCClientDelegate {
  func webRTC(_ client: WebRTCClient, didDiscoverLocalCandidate candidate: RTCIceCandidate) {
    debugPrint("Discovered local candidate")
    self.signal?.send(candidate: candidate)
    self.delegate?.webRTC(didDiscoverLocalCandidate: candidate)
  }
    
  func webRTC(_ client: WebRTCClient, didChangeConnectionState state: RTCIceConnectionState) {
    debugPrint("Changed connection state")
    self.delegate?.webRTC(didChangeConnectionState: state)
//    DispatchQueue.main.async {
//      self.status = state.description.capitalized
//    }
  }
    
  func webRTC(_ client: WebRTCClient, didReceiveData data: Data) {
    debugPrint(
      "Message from WebRTC: \(String(data: data, encoding: .utf8) ?? "(Binary: \(data.count) bytes)")")
//    self.reportAlert(
//      title: "Message from WebRTC",
//      message: String(data: data, encoding: .utf8) ?? "(Binary: \(data.count) bytes)",
//      primaryButtonTitle: "OK",
//      secondaryButtonTitle: nil,
//      primaryAction: nil,
//      secondaryAction: nil)
  }
}
