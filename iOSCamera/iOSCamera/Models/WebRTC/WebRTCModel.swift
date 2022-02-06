//
//  WebRTCModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/27.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

protocol WebRTCModelDelegate: AlertReportingDelegate {
  func didConnect()
  
  func didDisconnect()
  
  func signal(didReceiveRemoteSdp sdp: RTCSessionDescription)
  
  func signal(didReceiveCandidate candidate: RTCIceCandidate)
  
  func webRTC(didDiscoverLocalCandidate candidate: RTCIceCandidate)
    
  func webRTC(didChangeConnectionState state: RTCIceConnectionState)
    
  func webRTC(didReceiveData data: Data)
}

class WebRTCCapture: VideoConfigure {
  var device: AVCaptureDevice?

  var renderer: RTCVideoRenderer?
}

class WebRTCModel: VideoConfiguring {
  weak var delegate: WebRTCModelDelegate?
  
  var signal: WebRTCSignal?

  let client: WebRTCClient = WebRTCClient(
    iceServers: WebRTCConstants.ICE_SERVERS)
  
  let capture: WebRTCCapture = WebRTCCapture(
    state: .ready)
  
  func start() {
    guard
      let delegate = self.delegate
    else {
      debugPrint("WebRTCModel requires delegation")
      return
    }
    self.client.delegate = self
    self.configure(self.capture, configure: self, alert: delegate)
  }
  
  func connect(URL: URL) {
    self.signal = WebRTCSignal(
      webSocket: WebSocket(URL: URL))
    self.signal?.delegate = self
    self.signal?.connect()
  }
  
  func disconnect() {
    self.signal?.disconnect()
    self.signal?.delegate = nil
    self.signal = nil
  }
}
