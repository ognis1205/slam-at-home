//
//  WebRTCModel+WebRTCSignalDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCModel: WebRTCSignalDelegate {
  func didConnect(_ signal: WebRTCSignal) {
    self.delegate?.didConnect()
  }
  
  func didDisconnect(_ signal: WebRTCSignal) {
    self.delegate?.didDisconnect()
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveRemoteSdp sdp: RTCSessionDescription) {
    debugPrint("Received remote sdp")
    self.client.set(remoteSdp: sdp) { (error) in
      self.delegate?.signal(didReceiveRemoteSdp: sdp)
    }
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveCandidate candidate: RTCIceCandidate) {
    debugPrint("Received remote candidate")
    self.client.set(remoteIce: candidate)
    self.delegate?.signal(didReceiveCandidate: candidate)
  }
}
