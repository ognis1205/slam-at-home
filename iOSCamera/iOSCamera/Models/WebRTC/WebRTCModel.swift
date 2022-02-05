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

class WebRTCConnection {
//  var URL: URL?
  
  var status: String = "Not Available"
  
//  var isConnected: Bool = false
  
  var hasRemoteSdp: Bool = false
  
  var numberOfLocalCandidate: Int = 0
  
  var numberOfRemoteCandidate: Int = 0
  
  func status(state: RTCIceConnectionState) {
    self.status = state.description.capitalized
  }
}

class WebRTCCapture: VideoConfigure {
  var device: AVCaptureDevice?

  var renderer: RTCVideoRenderer?
}

class WebRTCModel: VideoConfiguring {
  weak var delegate: WebRTCModelDelegate?
  
  var URL: URL?

  var signal: WebRTCSignal?

  let client: WebRTCClient = WebRTCClient(
    iceServers: WebRTCConstants.ICE_SERVERS)
  
  let capture: WebRTCCapture = WebRTCCapture(
    state: .ready)
  
  func start() {
    guard
      let delegate = self.delegate
    else {
      debugPrint("HLSModel requires delegation")
      return
    }
    self.client.delegate = self
    self.configure(self.capture, configure: self, alert: delegate)
  }
  
  func connect() {
    guard
      let URL = self.URL
    else {
      debugPrint("URL of signaling server is not set")
      return
    }
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

//class WebRTCsignaling: NSObject, ObservableObject, WebRTCSignaling {
//  @Published var showAlert: Bool = false
  
//  @Published var status: String = "disconnected"
  
//  @Published var isConnected: Bool = false
  
//  @Published var hasRemoteSdp: Bool = false
  
//  @Published var numberOfLocalCandidate: Int = 0
  
//  @Published var numberOfRemoteCandidate: Int = 0
  
//  var alert: AlertModel?

//  var signal: WebRTCSignal?

//  var client: WebRTCClient?
  
//  var URL: URL?
//}
