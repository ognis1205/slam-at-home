//
//  Session.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import CocoaAsyncSocket

class Session {
  /// Identifier.
  var id: Int

  /// Asyncronous socket.
  fileprivate var socket: GCDAsyncSocket
  
  /// Cocoa async socket dispatch queue.
  fileprivate var dispatchQueue: DispatchQueue

  /// Data stack to send.
  fileprivate var dataStack = Queue<Data>(capacity: 1)

  /// Specifies whether streaming is started or not.
  fileprivate var isStreaming = false

  /// Streaming footer.
  fileprivate let footer = [
    "",
    ""
  ].joined(separator: "\r\n").data(using: String.Encoding.utf8)

  /// Specifies whether connection is established or not.
  var isConnected = true

  /// Data to send.
  var dataToSend: Data? {
    didSet {
      guard let dataToSend = self.dataToSend else {
        return
      }
      self.dataStack.push(dataToSend)
    }
  }

  /// Initializer.
  ///
  /// - Parameters:
  ///   - id: The ideintifier of this session.
  ///   - socket: Cocoa asyncronous socket of this session.
  ///   - dispatchQueue:Cocoa asyncronous socket dispatcher.
  init(id: Int, socket: GCDAsyncSocket, dispatchQueue: DispatchQueue) {
    print("Creating client [#\(id)]")
    self.id = id
    self.socket = socket
    self.dispatchQueue = dispatchQueue
  }

  /// Closes the connection.
  func close() {
    print("Closing client [#\(self.id)]")
    self.isConnected = false
  }

  /// Starts the streaming session.
  func start() {
    self.dispatchQueue.async(execute: { [unowned self] in
      while self.isConnected {
        if !self.isStreaming {
          print("Sending headers [#\(self.id)]")
          guard let header = [
            "HTTP/1.0 200 OK",
            "Connection: keep-alive",
            "Ma-age: 0",
            "Expires: 0",
            "Cache-Control: no-store,must-revalidate",
            "Access-Control-Allow-Origin: *",
            "Access-Control-Allow-Headers: accept,content-type",
            "Access-Control-Allow-Methods: GET",
            "Access-Control-expose-headers: Cache-Control,Content-Encoding",
            "Pragma: no-cache",
            "Content-type: multipart/x-mixed-replace; boundary=0123456789876543210",
            ""
          ].joined(separator: "\r\n").data(using: String.Encoding.utf8) else {
            print("Could not make headers data [#\(self.id)]")
            return
          }
          self.isStreaming = true
          self.socket.write(header, withTimeout: -1, tag: 0)
        } else {
          if (self.socket.connectedPort.hashValue == 0 || !self.socket.isConnected) {
            self.close()
            print("Dropping client [#\(self.id)]")
          }
          if let data = self.dataStack.pop() {
            guard let header = [
              "",
              "--0123456789876543210",
              "Content-Type: image/jpeg",
              "Content-Length: \(data.count)",
              "",
              ""
            ].joined(separator: "\r\n").data(using: String.Encoding.utf8) else {
              print("Could not make frame headers data [#\(self.id)]")
              return
            }
            self.socket.write(header, withTimeout: -1, tag: 0)
            self.socket.write(data, withTimeout: -1, tag: 0)
            self.socket.write(self.footer!, withTimeout: -1, tag: self.id)
          }
        }
      }
    })
  }
}
