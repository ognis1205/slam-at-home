//
//  HttpLiveStreaming.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/30.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import WebRTC

public enum Message {
  case sdp(SessionDescription)
  case candidate(IceCandidate)
}

extension Message: Codable {
  /// Initializer.
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

  /// Encodes SDP/ICE candidates.
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

public protocol WebRTCSignaling: AnyObject {
  /// Connects to the signaling server.
  func connect() -> Void

  /// Sends WebRTC SDP to the server.
  func send(sdp rtcSdp: RTCSessionDescription) -> Void

  /// Sends WebRTC ICE candidate to the server.
  func send(candidate rtcIceCandidate: RTCIceCandidate) -> Void
}

public protocol WebRTCSignalingDelegate: AnyObject {
  /// Called when new connection has created.
  func socket(_ socket: WebSocket, didReceiveData data: Data) -> Void
  
  /// Called when connection has established.
  func didConnect(_ signal: WebRTCSignaling)

  /// Called when connection has destroyed.
  func didDisconnect(_ signal: WebRTCSignaling)

  /// Called when SDP request are sent.
  func signal(_ signal: WebRTCSignaling, didReceiveRemoteSdp sdp: RTCSessionDescription)

  /// Called when ICE request are sent.
  func signal(_ signal: WebRTCSignaling, didReceiveCandidate candidate: RTCIceCandidate)
}
