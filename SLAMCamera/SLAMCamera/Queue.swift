//
//  Queue.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

/// Represents `Queue` items.
private class Entry<T> {
  /// Immutable assigned value of the item.
  fileprivate let value: T!

  /// Holds the reference to the next item.
  fileprivate var next: Entry?

  /// Initializer.
  ///
  /// - Parameters:
  ///   - value: The newly assigned value.
  init(_ value: T?) {
    self.value = value
  }
}

/// Represents general purpose queues.
open class Queue<T> {
  /// The head entry of the queue.
  fileprivate var head: Entry<T>
  
  /// The tail entry of the queue.
  fileprivate var tail: Entry<T>

  /// The maximum capacity of the queue.
  fileprivate var capacity: Int

  /// The current size of the queue.
  fileprivate var length = 0

  /// Initializer.
  ///
  /// - Parameters:
  ///   - capacity: The maximum capacity of the queue.
  public init(capacity: Int) {
    self.tail = Entry(nil)
    self.head = self.tail
    self.capacity = capacity
  }

  /// Pushes a new item into the tail of the queue.
  ///
  /// - Parameters:
  ///   - value: The newly assigned item to the queue.
  open func push(_ value: T) {
    if self.length >= self.capacity {
      self.tail = Entry(value)
    } else {
      self.tail.next = Entry(value)
      self.tail = self.tail.next!
      self.length += 1
    }
  }

  /// Pops the oldest item from the head of the queue.
  ///
  /// - Returns: The oldest assigned item from the queue.
  open func pop() -> T? {
    if let new = self.head.next {
      self.head = new
      self.length -= 1
      return new.value
    } else {
      self.length = 0
      return nil
    }
  }

  /// Checks if the queue is empty or not.
  ///
  /// - Returns: `true` if the queue is empty.
  open func isEmpty() -> Bool {
    return self.head === self.tail
  }
}
