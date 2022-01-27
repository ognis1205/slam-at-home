//
//  WebRTCSignaling.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/27.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

public protocol WebRTCSignaling: WebRTCSignalDelegate, WebRTCClientDelegate, AlertReporting {
  var client: WebRTCClient { get set }

  var signal: WebRTCSignal { get set }
  
  var status: String { get set }
  
  var isConnected: Bool { get set }
  
  var hasRemoteSdp: Bool { get set }
  
  var numberOfLocalCandidate: Int { get set }
  
  var numberOfRemoteCandidate: Int { get set }
  
  func connect(_ capture: VideoCapture)
}

public extension WebRTCSignaling {
  func didConnect(_ signal: WebRTCSignal) {
    self.isConnected = true
  }
  
  func didDisconnect(_ signal: WebRTCSignal) {
    self.isConnected = false
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveRemoteSdp sdp: RTCSessionDescription) {
    debugPrint("Received remote sdp")
    self.client.set(remoteSdp: sdp) { (error) in
      self.hasRemoteSdp = true
    }
  }
  
  func signal(_ signal: WebRTCSignal, didReceiveCandidate candidate: RTCIceCandidate) {
    debugPrint("Received remote candidate")
    self.numberOfRemoteCandidate += 1
    self.client.set(remoteIce: candidate)
  }
}

public extension WebRTCSignaling {
  func webRTC(_ client: WebRTCClient, didDiscoverLocalCandidate candidate: RTCIceCandidate) {
    print("Discovered local candidate")
    self.numberOfLocalCandidate += 1
    self.signal.send(candidate: candidate)
  }
    
  func webRTC(_ client: WebRTCClient, didChangeConnectionState state: RTCIceConnectionState) {
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
