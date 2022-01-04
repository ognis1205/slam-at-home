//
//  NativeHttpLiveStreaming.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import CocoaAsyncSocket

private class Entry<T> {
  /// Immutable assigned value of the item.
  fileprivate let value: T!

  /// Holds the reference to the next item.
  fileprivate var next: Entry?

  /// Initializer.
  init(_ value: T?) {
    self.value = value
  }
}

private class Queue<T> {
  /// Peep operation types.
  public enum PeepType {
    case HEAD
    case TAIL
  }

  /// The head entry of the queue.
  private var head: Entry<T>
  
  /// The tail entry of the queue.
  private var tail: Entry<T>

  /// The maximum capacity of the queue.
  private var capacity: Int

  /// The current size of the queue.
  private var length: Int = 0

  /// Initializer.
  public init(capacity: Int) {
    self.tail = Entry(nil)
    self.head = self.tail
    self.capacity = capacity
  }

  /// Pushes a new item into the tail of the queue.
  public func push(_ value: T) -> Void {
    if self.length >= self.capacity {
      self.tail = Entry(value)
    } else {
      self.tail.next = Entry(value)
      self.tail = self.tail.next!
      self.length += 1
    }
  }

  /// Pops the oldest item from the head of the queue.
  public func pop() -> T? {
    if let new = self.head.next {
      self.head = new
      self.length -= 1
      return new.value
    } else {
      self.length = 0
      return nil
    }
  }

  /// Peeps the item from the queue.
  public func peep(_ type: PeepType = PeepType.HEAD) -> T? {
    switch type {
    case .HEAD:
      if let entry = self.head.next {
        return entry.value
      } else {
        return nil
      }
    case .TAIL:
      if let value = self.tail.value {
        return value
      } else {
        return nil
      }
    }
  }

  /// Returns the current lenght of the queue.
  public func getLength() -> Int {
    return self.length
  }

  /// Checks if the queue is empty or not.
  public func isEmpty() -> Bool {
    return self.head === self.tail
  }
}


public class NativeHttpLiveStreaming: HttpLiveStreaming {
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
  private var dataStack: Queue<Data> = Queue<Data>(capacity: 1)

  /// Specifies whether streaming is started or not.
  private var isStreaming: Bool = false

  /// Streaming footer.
  private let footer: Data? = [
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
    debugPrint("Creating connection [#\(id)]")
    self.id = id
    self.socket = socket
    self.dispatchQueue = dispatchQueue
  }

  /// Starts the streaming session.
  public func connect() -> Void {
    self.dispatchQueue.async(execute: { [unowned self] in
      while self.isConnected {
        if !self.isStreaming {
          debugPrint("Sending header [#\(self.id)]")
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
            debugPrint("Could not make header data [#\(self.id)]")
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
              debugPrint("Could not make frame header data [#\(self.id)]")
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