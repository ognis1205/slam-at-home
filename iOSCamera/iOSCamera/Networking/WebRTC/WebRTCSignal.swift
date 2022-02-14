//
//  WebRTCSignal.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

enum Message {
  case sdp(SessionDescription)
  case candidate(IceCandidate)
}

extension Message: Codable {
  // MARK: Properties

  enum DecodeError: Error {
    case unknownType
  }
    
  enum CodingKeys: String, CodingKey {
    case type, payload
  }

  // MARK: Init

  init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    let type = try container.decode(String.self, forKey: .type)
    switch type {
    case String(describing: SessionDescription.self):
      self = .sdp(try container.decode(SessionDescription.self, forKey: .payload))
    case String(describing: IceCandidate.self):
      self = .candidate(try container.decode(IceCandidate.self, forKey: .payload))
    default:
      throw DecodeError.unknownType
    }
  }
  
  // MARK: Methods

  func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    switch self {
    case .sdp(let sessionDescription):
      try container.encode(sessionDescription, forKey: .payload)
      try container.encode(String(describing: SessionDescription.self), forKey: .type)
    case .candidate(let iceCandidate):
      try container.encode(iceCandidate, forKey: .payload)
      try container.encode(String(describing: IceCandidate.self), forKey: .type)
    }
  }
}

protocol WebRTCSignalDelegate: AnyObject {
  // MARK: Methods

  func didConnect(_ signal: WebRTCSignal)

  func didDisconnect(_ signal: WebRTCSignal)

  func signal(_ signal: WebRTCSignal, didReceiveRemoteSdp sdp: RTCSessionDescription)

  func signal(_ signal: WebRTCSignal, didReceiveCandidate candidate: RTCIceCandidate)
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
  
  func disconnect() {
    self.webSocket.disconnect(force: true)
    self.webSocket.delegate = nil
  }

  func send(sdp rtcSdp: RTCSessionDescription) {
    self.info("send session description...")
    let message = Message.sdp(SessionDescription(from: rtcSdp))
    do {
      let data = try self.encoder.encode(message)
      self.webSocket.send(data: data)
    } catch {
      self.warn("could not encode sdp: \(error)...")
    }
  }

  func send(candidate rtcIceCandidate: RTCIceCandidate) {
    self.info("send ice candidate...")
    let message = Message.candidate(IceCandidate(from: rtcIceCandidate))
    do {
      let data = try self.encoder.encode(message)
      self.webSocket.send(data: data)
    } catch {
      self.warn("could not encode candidate: \(error)...")
    }
  }
}