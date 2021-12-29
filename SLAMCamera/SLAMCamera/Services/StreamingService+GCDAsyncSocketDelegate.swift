//
//  StreamingService.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import AVFoundation
import CocoaAsyncSocket

extension StreamingService: GCDAsyncSocketDelegate {
  public func socket(_ sock: GCDAsyncSocket, didAcceptNewSocket newSocket: GCDAsyncSocket) {
    print("New connection from IP [\(newSocket.connectedHost ?? "unknown")]")
    guard let id = newSocket.connectedAddress?.hashValue else { return }
    let newConnection = HLS(
      id: id,
      socket: newSocket,
      dispatchQueue: self.connectionQueue)
    self.connections[id] = newConnection
    newConnection.open()
    DispatchQueue.main.async(execute: {
      self.isConnected = true
    })
  }
}
