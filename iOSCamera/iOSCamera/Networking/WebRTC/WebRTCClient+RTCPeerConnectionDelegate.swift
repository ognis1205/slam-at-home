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
  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange stateChanged: RTCSignalingState
  ) {
    debugPrint("peerConnection new signaling state: \(stateChanged)")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didAdd stream: RTCMediaStream
  ) {
    debugPrint("peerConnection did add stream")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didRemove stream: RTCMediaStream
  ) {
    debugPrint("peerConnection did remote stream")
  }

  func peerConnectionShouldNegotiate(
    _ peerConnection: RTCPeerConnection
  ) {
    debugPrint("peerConnection should negotiate")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange newState: RTCIceConnectionState
  ) {
    debugPrint("peerConnection new connection state: \(newState)")
    self.delegate?.webRTC(self, didChangeConnectionState: newState)
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange newState: RTCIceGatheringState
  ) {
    debugPrint("peerConnection new gathering state: \(newState)")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didGenerate candidate: RTCIceCandidate
  ) {
    self.delegate?.webRTC(self, didDiscoverLocalCandidate: candidate)
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didRemove candidates: [RTCIceCandidate]
  ) {
    debugPrint("peerConnection did remove candidate(s)")
  }

  func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didOpen dataChannel: RTCDataChannel
  ) {
    debugPrint("peerConnection did open data channel")
    self.dataChannel.reciever = dataChannel
  }
}
