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
      self.isConnected = true
      self.status = WebRTCStatus.connected.rawValue.capitalized
    }
  }

  func didDisconnect() {
    DispatchQueue.main.async {
      self.isConnected = false
      self.status = WebRTCStatus.disconnected.rawValue.capitalized
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
