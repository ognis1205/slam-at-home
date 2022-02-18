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

  func didDisconnect(_ socket: WebSocket, didFail error: Error?)

  func socket(_ socket: WebSocket, didReceiveData data: Data)
}

class WebSocket: NSObject, Debuggable {
  // MARK: Properties

  weak var delegate: WebSocketDelegate?

  private let URL: URL

  private var socket: URLSessionWebSocketTask?

  private lazy var urlSession: URLSession = URLSession(
    configuration: .default,
    delegate: self,
    delegateQueue: nil)
  
  // MARK: Init

  @available(*, unavailable)
  override init() {
    fatalError("init() is unavailable...")
  }

  required init(URL: URL) {
    self.URL = URL
    super.init()
  }
  
  // MARK: Methods

  func connect() {
    self.info("connect to socket server...")
    let socket = urlSession.webSocketTask(with: self.URL)
    socket.resume()
    self.socket = socket
    self.receive()
  }
  
  func disconnect(didFail error: Error?) {
    self.info("disconnect from socket server...")
    self.socket?.cancel()
    self.socket = nil
    self.delegate?.didDisconnect(self, didFail: error)
  }

  func send(data: Data) {
    self.info("send data...")
    self.socket?.send(.data(data)) { _ in }
  }

  private func receive() {
    self.info("receive data...")
    self.socket?.receive { [weak self] message in
      guard let self = self else { return }
      switch message {
      case .success(.data(let data)):
        self.info("recieve data \(String(describing: data))...")
        self.delegate?.socket(self, didReceiveData: data)
        self.receive()
      case .success:
        self.warn("expected to receive data format but received a string...")
        self.receive()
      case .failure(let failure):
        self.warn("failed to recieve data...")
        self.disconnect(didFail: failure)
      }
    }
  }
}
