//
//  WebSocket.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

protocol WebSocketDelegate: AnyObject {
  func didConnect(_ socket: WebSocket)

  func didDisconnect(_ socket: WebSocket, force: Bool)

  func socket(_ socket: WebSocket, didReceiveData data: Data)
}

class WebSocket: NSObject {
  weak var delegate: WebSocketDelegate?

  private let URL: URL

  private var socket: URLSessionWebSocketTask?

  private lazy var urlSession: URLSession = URLSession(
    configuration: .default,
    delegate: self,
    delegateQueue: nil)

  @available(*, unavailable)
  override init() {
    fatalError("NativeWebSocket:init is unavailable")
  }

  required init(URL: URL) {
    self.URL = URL
    super.init()
  }

  func connect() {
    let socket = urlSession.webSocketTask(with: self.URL)
    socket.resume()
    self.socket = socket
    self.receive()
  }
  
  func disconnect(force: Bool) {
    self.socket?.cancel()
    self.socket = nil
    self.delegate?.didDisconnect(self, force: force)
  }

  func send(data: Data) {
    self.socket?.send(.data(data)) { _ in }
  }

  private func receive() {
    self.socket?.receive { [weak self] message in
      guard let self = self else { return }
      switch message {
      case .success(.data(let data)):
        self.delegate?.socket(self, didReceiveData: data)
        self.receive()
      case .success:
        debugPrint("Warning: Expected to receive data format but received a string.")
        self.receive()
      case .failure:
        self.disconnect(force: false)
      }
    }
  }
}
