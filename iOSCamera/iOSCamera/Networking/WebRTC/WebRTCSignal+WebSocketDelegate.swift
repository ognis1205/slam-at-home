//
//  WebRTCSignal+WebSocketDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

extension WebRTCSignal: WebSocketDelegate {
  // MARK: Methods

  func didConnect(_ webSocket: WebSocket) {
    self.info("didConnect web socket...")
    self.delegate?.didConnect(self)
  }

  func didDisconnect(_ webSocket: WebSocket, didFail error: Error?) {
    self.info("didDisconnect web socket...")
    self.delegate?.didDisconnect(self, didFail: error)
  }

  func socket(_ webSocket: WebSocket, didReceiveData data: Data) {
    self.info("socket did recieve data...")
    let signal: Signal
    do {
      signal = try self.decoder.decode(Signal.self, from: data)
    } catch {
      self.warn("could not decode incoming signal: \(error)...")
      return
    }
    switch signal {
    case let .candidate(iceCandidate, _, _):
      self.delegate?.signal(self, didReceiveCandidate: iceCandidate.rtcIceCandidate)
    case let .sdp(sessionDescription, _, _):
      self.delegate?.signal(self, didReceiveRemoteSdp: sessionDescription.rtcSessionDescription)
    }
  }
}
