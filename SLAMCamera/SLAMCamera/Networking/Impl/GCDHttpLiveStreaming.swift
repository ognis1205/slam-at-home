//
//  GCDHttpLiveStreaming.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import CocoaAsyncSocket

public class GCDHttpLiveStreaming: HttpLiveStreaming {
  /// Identifier.
  public var id: Int

  /// Data to send.
  public var dataToSend: Data? {
    didSet {
      guard let dataToSend = self.dataToSend else {
        return
      }
      self.dataStack.push(dataToSend)
    }
  }
  
  /// Specifies whether connection is established or not.
  public var isConnected: Bool {
    get {
      return !(self.socket.connectedPort.hashValue == 0 || !self.socket.isConnected)
    }
  }

  /// Asyncronous socket.
  private var socket: GCDAsyncSocket
  
  /// Worker queue.
  private var dispatchQueue: DispatchQueue

  /// Data stack to send.
  private var dataStack = Queue<Data>(capacity: 1)

  /// Specifies whether streaming is started or not.
  private var isStreaming = false

  /// Streaming footer.
  private let footer = [
    "",
    ""
  ].joined(separator: "\r\n").data(using: String.Encoding.utf8)

  /// Initializer.
  ///
  /// - Parameters:
  ///   - id: The ideintifier of this session.
  ///   - socket: Cocoa asyncronous socket of this session.
  ///   - dispatchQueue:The worker queue.
  public init(id: Int, socket: GCDAsyncSocket, dispatchQueue: DispatchQueue) {
    print("Creating connection [#\(id)]")
    self.id = id
    self.socket = socket
    self.dispatchQueue = dispatchQueue
  }

  /// Starts the streaming session.
  public func connect() {
    self.dispatchQueue.async(execute: { [unowned self] in
      while self.isConnected {
        if !self.isStreaming {
          print("Sending header [#\(self.id)]")
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
            print("Could not make header data [#\(self.id)]")
            return
          }
          self.isStreaming = true
          self.socket.write(header, withTimeout: -1, tag: 0)
        } else {
          if let data = self.dataStack.pop() {
            guard let header = [
              "",
              "--0123456789876543210",
              "Content-Type: image/jpeg",
              "Content-Length: \(data.count)",
              "",
              ""
            ].joined(separator: "\r\n").data(using: String.Encoding.utf8) else {
              print("Could not make frame header data [#\(self.id)]")
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
