//
//  WebRTCViewModel+WebRTCModelDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/07.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCViewModel: WebRTCModelDelegate {
  // MARK: Methods

  func didConnect() {
    DispatchQueue.main.async {
      self.isSignaling = true
    }
  }

  func didDisconnect() {
    DispatchQueue.main.async {
      self.isSignaling = false
    }
  }

  func signal(didReceiveRemoteSdp sdp: RTCSessionDescription) {
    DispatchQueue.main.async {
      self.hasRemoteSdp = true
    }
  }

  func signal(didReceiveCandidate candidate: RTCIceCandidate) {
    DispatchQueue.main.async {
      self.numberOfRemoteCandidate += 1
    }
  }

  func webRTC(didDiscoverLocalCandidate candidate: RTCIceCandidate) {
    DispatchQueue.main.async {
      self.numberOfLocalCandidate += 1
    }
  }

  func webRTC(didChangeConnectionState state: RTCIceConnectionState) {
    DispatchQueue.main.async {
//      self.status = state.description.capitalized
    }
  }

  func webRTC(didReceiveData data: Data) {
    // Do nothing.
  }
  
  func webRTC(didChangeSignalingState state: RTCSignalingState) {
    DispatchQueue.main.async {
      self.signalingState = state.description.capitalized
    }
  }

  func alert(_ alert: AlertModel) {
    DispatchQueue.main.async {
      self.showAlert = true
      self.alert = alert
    }
  }
}
