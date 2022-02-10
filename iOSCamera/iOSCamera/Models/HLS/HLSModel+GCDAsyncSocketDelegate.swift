//
//  HLSModel+GCDAsyncSocketDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import CocoaAsyncSocket
import Foundation

extension HLSModel: GCDAsyncSocketDelegate {
  func socket(
    _ sock: GCDAsyncSocket,
    didAcceptNewSocket newSocket: GCDAsyncSocket
  ) {
    self.info("new connection from IP [\(newSocket.connectedHost ?? "unknown")]...")
    guard
      let id = newSocket.connectedAddress?.hashValue
    else {
      return
    }
    let newStream = HLSStream(
      id: id,
      socket: newSocket,
      dispatchQueue: DispatchQueue(
        label: "stream",
        attributes: .concurrent))
    self.streams[id] = newStream
    newStream.open()
    DispatchQueue.main.async(execute: {
      self.info("connect...")
      self.delegate?.didConnect()
    })
  }
}
