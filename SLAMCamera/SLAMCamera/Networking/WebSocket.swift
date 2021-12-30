//
//  WebSocket.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/30.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation

public protocol WebSocket: AnyObject {
  /// Web socket delegation.
  var delegate: WebSocketDelegate? { get set }

  /// Starts the streaming session.
  func connect()

  /// Sends a data on the stream.
  func send(data: Data)
}

public protocol WebSocketDelegate: AnyObject {
  /// Called when connection has established.
  func didConnect(_ socket: WebSocket)

  /// Called when connection has destroyed.
  func didDisconnect(_ socket: WebSocket)

  /// Called when new connection has created.
  func socket(_ socket: WebSocket, didReceiveData data: Data)
}
