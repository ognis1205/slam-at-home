//
//  HttpLiveStreaming.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import CocoaAsyncSocket
import Foundation

private class Entry<T> {
  fileprivate let value: T?

  fileprivate var next: Entry?

  init(_ value: T?) {
    self.value = value
  }
}

private class Queue<T> {
  public enum PeepType {
    case HEAD
    case TAIL
  }

  private var head: Entry<T>

  private var tail: Entry<T>

  private var capacity: Int

  private var length: Int = 0

  public init(capacity: Int) {
    self.tail = Entry(nil)
    self.head = self.tail
    self.capacity = capacity
  }

  public func push(_ value: T) {
    if self.length >= self.capacity {
      self.tail = Entry(value)
    } else {
      self.tail.next = Entry(value)
      if let tail = self.tail.next {
        self.tail = tail
        self.length += 1
      }
    }
  }

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

  public func getLength() -> Int {
    return self.length
  }

  public func isEmpty() -> Bool {
    return self.head === self.tail
  }
}

public class HLSStream {
  public var id: Int

  public var dataToSend: Data? {
    didSet {
      guard let dataToSend = self.dataToSend else {
        return
      }
      self.dataStack.push(dataToSend)
    }
  }
  
  public var isConnected: Bool {
    return !(self.socket.connectedPort.hashValue == 0 || !self.socket.isConnected)
  }
  
  private var isStreaming: Bool = false

  private var socket: GCDAsyncSocket
  
  private var dispatchQueue: DispatchQueue

  private var dataStack: Queue<Data> = Queue<Data>(capacity: 1)

  public init(id: Int, socket: GCDAsyncSocket, dispatchQueue: DispatchQueue) {
    debugPrint("Creating connection [#\(id)]")
    self.id = id
    self.socket = socket
    self.dispatchQueue = dispatchQueue
  }

  public func open() {
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
            guard
              let header = [
                "",
                "--0123456789876543210",
                "Content-Type: image/jpeg",
                "Content-Length: \(data.count)",
                "",
                ""
              ].joined(separator: "\r\n").data(using: String.Encoding.utf8),
              let footer = [
                "",
                ""
              ].joined(separator: "\r\n").data(using: String.Encoding.utf8)
            else {
              debugPrint("Could not make frame header/footer data [#\(self.id)]")
              return
            }
            self.socket.write(header, withTimeout: -1, tag: 0)
            self.socket.write(data, withTimeout: -1, tag: 0)
            self.socket.write(footer, withTimeout: -1, tag: self.id)
          }
        }
      }
    })
  }
}
