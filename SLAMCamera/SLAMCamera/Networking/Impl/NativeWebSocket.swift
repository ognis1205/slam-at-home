//
//  NativeWebSocket.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/30.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation

public class NativeWebSocket: NSObject, WebSocket {
  /// Holds a delegater.
  public var delegate: WebSocketDelegate?

  /// The URL of the service.
  private let url: URL

  /// Holds a WebSocket task.
  private var socket: URLSessionWebSocketTask?

  /// Holds a URL session.
  private lazy var urlSession: URLSession = URLSession(
    configuration: .default,
    delegate: self,
    delegateQueue: nil)

  @available(*, unavailable)
  override init() {
    fatalError("NativeWebSocket:init is unavailable")
  }

  /// Initializer.
  public required init(url: URL) {
    self.url = url
    super.init()
  }

  /// Starts the streaming session.
  public func connect() {
    let socket = urlSession.webSocketTask(with: url)
    socket.resume()
    self.socket = socket
    self.receive()
  }

  /// Ends the streaming session.
  internal func disconnect() {
    self.socket?.cancel()
    self.socket = nil
    self.delegate?.didDisconnect(self)
  }

  /// Sends a data on the stream.
  public func send(data: Data) {
    self.socket?.send(.data(data)) { _ in }
  }

  /// Recieves a message from the socket.
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
          self.disconnect()
      }
    }
  }
}
