//
//  WebRTCViewModel+WebRTCModelDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/07.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCViewModel: WebRTCModelDelegate {
  func didConnect() {
    self.isConnected = true
  }

  func didDisconnect() {
    self.isConnected = false
  }

  func signal(didReceiveRemoteSdp sdp: RTCSessionDescription) {
    self.hasRemoteSdp = true
  }

  func signal(didReceiveCandidate candidate: RTCIceCandidate) {
    self.numberOfRemoteCandidate += 1
  }

  func webRTC(didDiscoverLocalCandidate candidate: RTCIceCandidate) {
    self.numberOfLocalCandidate += 1
  }
    
  func webRTC(didChangeConnectionState state: RTCIceConnectionState) {
    DispatchQueue.main.async {
      self.status = state.description.capitalized
    }
  }
    
  func webRTC(didReceiveData data: Data) {
    // Do nothing.
  }
  
  func alert(_ alert: AlertModel) {
    self.showAlert = true
    self.alert = alert
  }
}
