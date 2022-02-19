//
//  WebRTCSignal.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

typealias SignalFrom = String

typealias SignalTo = String

enum Signal {
  case sdp(SessionDescription, SignalFrom, SignalTo)
  case candidate(IceCandidate, SignalFrom, SignalTo)
}

extension Signal: Codable {
  // MARK: Properties

  enum DecodeError: Error {
    case unknownType
  }
    
  enum CodingKeys: String, CodingKey {
    case from, to, type, payload
  }

  // MARK: Init

  init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    let type = try container.decode(String.self, forKey: .type)
    switch type {
    case String(describing: SessionDescription.self):
      self = .sdp(
        try container.decode(SessionDescription.self, forKey: .payload),
        try container.decode(String.self, forKey: .from),
        try container.decode(String.self, forKey: .to))
    case String(describing: IceCandidate.self):
      self = .candidate(
        try container.decode(IceCandidate.self, forKey: .payload),
        try container.decode(String.self, forKey: .from),
        try container.decode(String.self, forKey: .to))
    default:
      throw DecodeError.unknownType
    }
  }
  
  // MARK: Methods

  func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    switch self {
    case .sdp(let sessionDescription, let from, let to):
      try container.encode(sessionDescription, forKey: .payload)
      try container.encode(String(describing: SessionDescription.self), forKey: .type)
      try container.encode(to, forKey: .to)
      try container.encode(from, forKey: .from)
    case .candidate(let iceCandidate, let from, let to):
      try container.encode(iceCandidate, forKey: .payload)
      try container.encode(String(describing: IceCandidate.self), forKey: .type)
      try container.encode(to, forKey: .to)
      try container.encode(from, forKey: .from)
    }
  }
}

protocol WebRTCSignalDelegate: AnyObject {
  // MARK: Methods

  func didConnect(_ signal: WebRTCSignal)

  func didDisconnect(_ signal: WebRTCSignal, didFail error: Error?)

  func signal(
    _ signal: WebRTCSignal,
    signalFrom: SignalFrom,
    signalTo: SignalTo,
    didReceiveRemoteSdp sdp: RTCSessionDescription)

  func signal(
    _ signal: WebRTCSignal,
    signalFrom: SignalFrom,
    signalTo: SignalTo,
    didReceiveCandidate candidate: RTCIceCandidate)
}

class WebRTCSignal: Debuggable {
  // MARK: Properties

  let decoder = JSONDecoder()

  let encoder = JSONEncoder()

  let webSocket: WebSocket

  weak var delegate: WebRTCSignalDelegate?
  
  // MARK: Init

  init(webSocket: WebSocket) {
    self.webSocket = webSocket
  }
  
  // MARK: Methods

  func connect() {
    self.webSocket.delegate = self
    self.webSocket.connect()
  }
  
  func disconnect(didFail error: Error?) {
    self.webSocket.disconnect(didFail: error)
    self.webSocket.delegate = nil
  }

  func send(
    sdp rtcSdp: RTCSessionDescription,
    signalFrom from: SignalFrom,
    signalTo to: SignalTo
  ) {
    self.info("send session description...")
    let signal = Signal.sdp(
      SessionDescription(from: rtcSdp),
      from,
      to)
    do {
      let data = try self.encoder.encode(signal)
      self.webSocket.send(data: data)
    } catch {
      self.warn("could not encode sdp: \(error)...")
    }
  }

  func send(
    candidate rtcIceCandidate: RTCIceCandidate,
    signalFrom from: SignalFrom,
    signalTo to: SignalTo
  ) {
    self.info("send ice candidate...")
    let signal = Signal.candidate(
      IceCandidate(from: rtcIceCandidate),
      from,
      to)
    do {
      let data = try self.encoder.encode(signal)
      self.webSocket.send(data: data)
    } catch {
      self.warn("could not encode candidate: \(error)...")
    }
  }
}
