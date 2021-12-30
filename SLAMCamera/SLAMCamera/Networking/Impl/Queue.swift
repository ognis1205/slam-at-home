//
//  Queue.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

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

public class Queue<T> {
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
