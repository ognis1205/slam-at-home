//
//  WebSocket+URLSessionWebSocketDelegate+URLSessionDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebSocket: URLSessionWebSocketDelegate, URLSessionDelegate {
  // MARK: Methods

  func urlSession(
    _ session: URLSession,
    webSocketTask: URLSessionWebSocketTask,
    didOpenWithProtocol protocol: String?
  ) {
    self.info("urlSession did open...")
    self.delegate?.didConnect(self)
  }
    
  func urlSession(
    _ session: URLSession,
    webSocketTask: URLSessionWebSocketTask,
    didCloseWith closeCode: URLSessionWebSocketTask.CloseCode,
    reason: Data?
  ) {
    self.info("urlSession did close...")
    self.disconnect(force: true)
  }
}
