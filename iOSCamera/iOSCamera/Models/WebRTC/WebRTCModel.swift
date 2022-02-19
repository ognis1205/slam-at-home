//
//  WebRTCModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/27.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

protocol WebRTCModelDelegate: AlertReportingDelegate {
  // MARK: Methods

  func didConnect()

  func didDisconnect()

  func signal(
    signalFrom from: SignalFrom,
    signalTo to: SignalTo,
    didReceiveRemoteSdp sdp: RTCSessionDescription)

  func signal(
    signalFrom from: SignalFrom,
    signalTo to: SignalTo,
    didReceiveCandidate candidate: RTCIceCandidate)

  func webRTC(didDiscoverLocalCandidate candidate: RTCIceCandidate)

  func webRTC(didChangeConnectionState state: RTCIceConnectionState)

  func webRTC(didReceiveData data: Data)

  func webRTC(didChangeSignalingState state: RTCSignalingState)
}

class WebRTCCapture: VideoConfigure {
  // MARK: Properties

  var device: AVCaptureDevice?
}

class WebRTCModel: VideoConfiguring {
  // MARK: Properties

  weak var delegate: WebRTCModelDelegate?
  
  var signal: WebRTCSignal?

  let client: WebRTCClient = WebRTCClient(
    iceServers: WebRTCConstants.ICE_SERVERS)
  
  let capture: WebRTCCapture = WebRTCCapture(
    state: .ready)
  
  // MARK: Methods
  
  func prepare() {
    self.info("prepare...")
    guard
      let delegate = self.delegate
    else {
      self.warn("requires delegation...")
      return
    }
    self.client.delegate = self
    self.configure(self.capture, configure: self, alert: delegate)
  }
  
  func start() {
    self.info("start...")
    guard
      let delegate = self.delegate
    else {
      self.warn("requires delegation...")
      return
    }
    self.capture(alert: delegate)
  }

  func capture(alert: AlertReportingDelegate) {
    self.info("capture...")
    guard
      let sender = self.client.videoTrack.sender
    else {
      self.warn("failed to retrieve sender...")
      return
    }
    self.client.connection.add(sender, streamIds: [self.client.streamId])
  }
  
  func connect(URL: URL) {
    self.info("connect...")
    if self.capture.state == .running {
      self.signal = WebRTCSignal(
        webSocket: WebSocket(URL: URL))
      self.signal?.delegate = self
      self.signal?.connect()
    }
  }
  
  func disconnect() {
    self.info("disconnect...")
    if self.capture.state == .running {
      self.signal?.disconnect(didFail: nil)
      self.signal?.delegate = nil
      self.signal = nil
    }
  }
}
