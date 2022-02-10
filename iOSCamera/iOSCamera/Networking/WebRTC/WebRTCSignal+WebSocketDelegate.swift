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

  func didDisconnect(_ webSocket: WebSocket, force: Bool) {
    self.info("didDisconnect web socket...")
    self.delegate?.didDisconnect(self)
    if !force {
      DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
        self.info("try to reconnect to signaling server...")
        self.webSocket.connect()
      }
    }
  }

  func socket(_ webSocket: WebSocket, didReceiveData data: Data) {
    self.info("socket did recieve data...")
    let message: Message
    do {
      message = try self.decoder.decode(Message.self, from: data)
    } catch {
      self.warn("could not decode incoming message: \(error)...")
      return
    }
    switch message {
    case .candidate(let iceCandidate):
      self.delegate?.signal(self, didReceiveCandidate: iceCandidate.rtcIceCandidate)
    case .sdp(let sessionDescription):
      self.delegate?.signal(self, didReceiveRemoteSdp: sessionDescription.rtcSessionDescription)
    }
  }
}
