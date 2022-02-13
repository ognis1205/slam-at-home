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
  
  func signal(didReceiveRemoteSdp sdp: RTCSessionDescription)
  
  func signal(didReceiveCandidate candidate: RTCIceCandidate)
  
  func webRTC(didDiscoverLocalCandidate candidate: RTCIceCandidate)
    
  func webRTC(didChangeConnectionState state: RTCIceConnectionState)
    
  func webRTC(didReceiveData data: Data)
}

class WebRTCCapture: VideoConfigure {
  // MARK: Properties

  var device: AVCaptureDevice?
}

// class WebRTCCapture: VideoConfigure {
//   // MARK: Properties
//
//   let session: AVCaptureSession
//
//   let output: AVCaptureVideoDataOutput
//
//   let context: CIContext
//
//   // MARK: Init
//
//   init(
//     session: AVCaptureSession,
//     output: AVCaptureVideoDataOutput,
//     context: CIContext,
//     state: VideoConfigureState
//   ) {
//     self.session = session
//     self.output = output
//     self.context = context
//     super.init(state: state)
//   }
// }

class WebRTCModel: VideoConfiguring {
  // MARK: Properties

  weak var delegate: WebRTCModelDelegate?
  
  var signal: WebRTCSignal?

  let client: WebRTCClient = WebRTCClient(
    iceServers: WebRTCConstants.ICE_SERVERS)
  
  let capture: WebRTCCapture = WebRTCCapture(
    state: .ready)
  
//   let capture: WebRTCCapture = WebRTCCapture(
//     session: AVCaptureSession(),
//     output: AVCaptureVideoDataOutput(),
//     context: CIContext(options: nil),
//     state: .ready)
  
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
//    let stream = WebRTCClient.factory.mediaStream(
//      withStreamId: self.client.streamId)
    guard
      let sender = self.client.videoTrack.sender
    else {
      self.warn("failed to retrieve sender...")
      return
    }
//    stream.addVideoTarack(sender)
    self.client.connection.add(sender, streamIds: [self.client.streamId])
//    switch self.capture.state {
//    case .running:
//      break
//    case .configured:
//      capture.session.startRunning()
//      if capture.session.isRunning {
//        capture.state(.running)
//      }
//    default:
//      self.warn("not authorized nor configured...")
//      self.alert(
//        alert,
//        title: "Camera Error",
//        message: "Camera configuration failed. Either your device camera is not available or its missing permissions",
//        primaryButtonTitle: "Accept",
//        secondaryButtonTitle: nil,
//        primaryAction: nil,
//        secondaryAction: nil)
//    }
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
      self.signal?.disconnect()
      self.signal?.delegate = nil
      self.signal = nil
    }
  }
}
