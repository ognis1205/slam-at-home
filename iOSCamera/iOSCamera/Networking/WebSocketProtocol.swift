//
//  WebSocketProtocol.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/30.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

import Foundation

public protocol WebSocketProtocol: AnyObject {
  /// Web socket delegation.
  var delegate: WebSocketDelegate? { get set }

  /// Starts the streaming session.
  func connect() -> Void

  /// Sends a data on the stream.
  func send(data: Data) -> Void
}

public protocol WebSocketDelegate: AnyObject {
  /// Called when connection has established.
  func didConnect(_ socket: WebSocketProtocol) -> Void

  /// Called when connection has destroyed.
  func didDisconnect(_ socket: WebSocketProtocol) -> Void

  /// Called when new message has arrived.
  func socket(_ socket: WebSocketProtocol, didReceiveData data: Data) -> Void
}
