//
//  WebRTCModel+WebRTCSignalDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCModel: WebRTCSignalDelegate {
  // MARK: Methods

  func didConnect(_ signal: WebRTCSignal) {
    self.info("did connect...")
    self.delegate?.didConnect()
  }
  
  func didDisconnect(_ signal: WebRTCSignal) {
    self.info("did disconnect...")
    self.delegate?.didDisconnect()
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveRemoteSdp sdp: RTCSessionDescription) {
    self.info("signal did recieve remote sdp...")
    self.client.set(remoteSdp: sdp) { (error) in
      self.delegate?.signal(didReceiveRemoteSdp: sdp)
    }
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveCandidate candidate: RTCIceCandidate) {
    self.info("signal did recieve candidate...")
    self.client.set(remoteIce: candidate)
    self.delegate?.signal(didReceiveCandidate: candidate)
  }
}
