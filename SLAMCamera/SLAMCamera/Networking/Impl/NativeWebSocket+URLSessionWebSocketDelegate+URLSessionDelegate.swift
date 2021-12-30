//
//  NativeWebSocket+URLSessionWebSocketDelegate+URLSessionDelegate.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/30.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation

extension NativeWebSocket: URLSessionWebSocketDelegate, URLSessionDelegate  {
  public func urlSession(
    _ session: URLSession,
    webSocketTask: URLSessionWebSocketTask,
    didOpenWithProtocol protocol: String?
  ) {
    self.delegate?.didConnect(self)
  }
    
  public func urlSession(
    _ session: URLSession,
    webSocketTask: URLSessionWebSocketTask,
    didCloseWith closeCode: URLSessionWebSocketTask.CloseCode,
    reason: Data?
  ) {
    self.disconnect()
  }
}
