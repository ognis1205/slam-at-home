//
//  WebRTCSignaling.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/27.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

protocol WebRTCSignaling: WebRTCSignalDelegate, WebRTCClientDelegate, AlertReporting {
  var client: WebRTCClient? { get set }

  var signal: WebRTCSignal? { get set }
  
  var URL: URL? { get set }
  
  var status: String { get set }
  
  var isConnected: Bool { get set }
  
  var hasRemoteSdp: Bool { get set }
  
  var numberOfLocalCandidate: Int { get set }
  
  var numberOfRemoteCandidate: Int { get set }
  
  func connect()
  
  func disconnect()
}

extension WebRTCSignaling {
  func didConnect(_ signal: WebRTCSignal) {
    self.isConnected = true
  }
  
  func didDisconnect(_ signal: WebRTCSignal) {
    self.isConnected = false
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveRemoteSdp sdp: RTCSessionDescription) {
    debugPrint("Received remote sdp")
    self.client?.set(remoteSdp: sdp) { (error) in
      self.hasRemoteSdp = true
    }
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveCandidate candidate: RTCIceCandidate) {
    debugPrint("Received remote candidate")
    self.numberOfRemoteCandidate += 1
    self.client?.set(remoteIce: candidate)
  }
}

extension WebRTCSignaling {
  func webRTC(_ client: WebRTCClient, didDiscoverLocalCandidate candidate: RTCIceCandidate) {
    debugPrint("Discovered local candidate")
    self.numberOfLocalCandidate += 1
    self.signal?.send(candidate: candidate)
  }
    
  func webRTC(_ client: WebRTCClient, didChangeConnectionState state: RTCIceConnectionState) {
    debugPrint("Changed connection state")
    DispatchQueue.main.async {
      self.status = state.description.capitalized
    }
  }
    
  func webRTC(_ client: WebRTCClient, didReceiveData data: Data) {
    self.reportAlert(
      title: "Message from WebRTC",
      message: String(data: data, encoding: .utf8) ?? "(Binary: \(data.count) bytes)",
      primaryButtonTitle: "OK",
      secondaryButtonTitle: nil,
      primaryAction: nil,
      secondaryAction: nil)
  }
}

extension WebRTCSignaling {
  func connect() {
    guard
      let URL = self.URL
    else {
      debugPrint("URL of signaling server is not set")
      return
    }
    self.client = WebRTCClient(
      iceServers: WebRTCConstants.ICE_SERVERS)
    self.signal = WebRTCSignal(
      webSocket: WebSocket(URL: URL))
    self.client?.delegate = self
    self.signal?.delegate = self
    self.signal?.connect()
  }
  
  func disconnect() {
    self.signal?.disconnect()
    self.signal?.delegate = nil
    self.client?.delegate = nil
    self.signal = nil
    self.client = nil
  }
}
