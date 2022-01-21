//
//  Signaling.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/31.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

public class Signaling: SignalingProtocol {
  /// SDP/ICE message decoder.
  internal let decoder = JSONDecoder()

  /// SDP/ICE message encoder.
  internal let encoder = JSONEncoder()

  /// Holds a reference to the associated web socket.
  internal let webSocket: WebSocket

  /// Websocket delegatee.
  public weak var delegate: SignalingDelegate?

  /// Initializer.
  public init(webSocket: WebSocket) {
    self.webSocket = webSocket
  }

  /// Connects to the signaling server.
  public func connect() {
    self.webSocket.delegate = self
    self.webSocket.connect()
  }

  /// Sends WebRTC SDP to the server.
  public func send(sdp rtcSdp: RTCSessionDescription) {
    let message = Message.sdp(SessionDescription(from: rtcSdp))
    do {
      let data = try self.encoder.encode(message)
      self.webSocket.send(data: data)
    } catch {
      debugPrint("Warning: Could not encode sdp: \(error)")
    }
  }

  /// Sends WebRTC ICE candidate to the server.
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
