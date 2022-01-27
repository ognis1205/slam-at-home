//
//  WebRTCSignal.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

public enum Message {
  case sdp(SessionDescription)
  case candidate(IceCandidate)
}

extension Message: Codable {
  public init(from decoder: Decoder) throws {
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

  public func encode(to encoder: Encoder) throws {
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

  enum DecodeError: Error {
    case unknownType
  }
    
  enum CodingKeys: String, CodingKey {
    case type, payload
  }
}

public protocol WebRTCSignalDelegate: AnyObject {
  func didConnect(_ signal: WebRTCSignal)

  func didDisconnect(_ signal: WebRTCSignal)

  func signal(_ signal: WebRTCSignal, didReceiveRemoteSdp sdp: RTCSessionDescription)

  func signal(_ signal: WebRTCSignal, didReceiveCandidate candidate: RTCIceCandidate)
}

public class WebRTCSignal {
  internal let decoder = JSONDecoder()

  internal let encoder = JSONEncoder()

  internal let webSocket: WebSocket

  public weak var delegate: WebRTCSignalDelegate?

  public init(webSocket: WebSocket) {
    self.webSocket = webSocket
  }

  public func connect() {
    self.webSocket.delegate = self
    self.webSocket.connect()
  }

  public func send(sdp rtcSdp: RTCSessionDescription) {
    let message = Message.sdp(SessionDescription(from: rtcSdp))
    do {
      let data = try self.encoder.encode(message)
      self.webSocket.send(data: data)
    } catch {
      debugPrint("Warning: Could not encode sdp: \(error)")
    }
  }

  public func send(candidate rtcIceCandidate: RTCIceCandidate) {
    let message = Message.candidate(IceCandidate(from: rtcIceCandidate))
    do {
      let data = try self.encoder.encode(message)
      self.webSocket.send(data: data)
    } catch {
      debugPrint("Warning: Could not encode candidate: \(error)")
    }
  }
}
