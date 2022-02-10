//
//  WebRTCClient+RTCPeerConnectionDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/26.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

extension WebRTCClient: RTCPeerConnectionDelegate {
  // MARK: Methods

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange stateChanged: RTCSignalingState
  ) {
    self.info("peerConnection new signaling state: \(stateChanged)...")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didAdd stream: RTCMediaStream
  ) {
    self.info("peerConnection did add stream...")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didRemove stream: RTCMediaStream
  ) {
    self.info("peerConnection did remote stream...")
  }

  func peerConnectionShouldNegotiate(
    _ peerConnection: RTCPeerConnection
  ) {
    self.info("peerConnection should negotiate...")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange newState: RTCIceConnectionState
  ) {
    self.info("peerConnection new connection state: \(newState)...")
    self.delegate?.webRTC(self, didChangeConnectionState: newState)
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange newState: RTCIceGatheringState
  ) {
    self.info("peerConnection new gathering state: \(newState)...")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didGenerate candidate: RTCIceCandidate
  ) {
    self.info("peerConnection new ice candidate: \(candidate)...")
    self.delegate?.webRTC(self, didDiscoverLocalCandidate: candidate)
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didRemove candidates: [RTCIceCandidate]
  ) {
    self.info("peerConnection did remove candidate(s)...")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didOpen dataChannel: RTCDataChannel
  ) {
    self.info("peerConnection did open data channel...")
    self.dataChannel.reciever = dataChannel
  }
}
