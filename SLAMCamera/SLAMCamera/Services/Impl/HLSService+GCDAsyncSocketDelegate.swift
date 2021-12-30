//
//  HLSService.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import AVFoundation
import CocoaAsyncSocket

extension HLSService: GCDAsyncSocketDelegate {
  public func socket(
    _ sock: GCDAsyncSocket,
    didAcceptNewSocket newSocket: GCDAsyncSocket
  ) -> Void {
    debugPrint("New connection from IP [\(newSocket.connectedHost ?? "unknown")]")
    guard let id = newSocket.connectedAddress?.hashValue else { return }
    let newConnection = GCDHttpLiveStreaming(
      id: id,
      socket: newSocket,
      dispatchQueue: self.connectionQueue)
    self.connections[id] = newConnection
    newConnection.connect()
    DispatchQueue.main.async(execute: {
      self.isConnected = true
    })
  }
}
