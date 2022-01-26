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
  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange stateChanged: RTCSignalingState
  ) {
    debugPrint("peerConnection new signaling state: \(stateChanged)")
  }

  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didAdd stream: RTCMediaStream
  ) {
    debugPrint("peerConnection did add stream")
  }

  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didRemove stream: RTCMediaStream
  ) {
    debugPrint("peerConnection did remote stream")
  }

  public func peerConnectionShouldNegotiate(
    _ peerConnection: RTCPeerConnection
  ) {
    debugPrint("peerConnection should negotiate")
  }

  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange newState: RTCIceConnectionState
  ) {
    debugPrint("peerConnection new connection state: \(newState)")
    self.delegate?.webRTC(self, didChangeConnectionState: newState)
  }

  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didChange newState: RTCIceGatheringState
  ) {
    debugPrint("peerConnection new gathering state: \(newState)")
  }

  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didGenerate candidate: RTCIceCandidate
  ) {
    self.delegate?.webRTC(self, didDiscoverLocalCandidate: candidate)
  }

  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didRemove candidates: [RTCIceCandidate]
  ) {
    debugPrint("peerConnection did remove candidate(s)")
  }

  public func peerConnection(
    _ peerConnection: RTCPeerConnection,
    didOpen dataChannel: RTCDataChannel
  ) {
    debugPrint("peerConnection did open data channel")
    self.recieverDataChannel = dataChannel
  }
}
