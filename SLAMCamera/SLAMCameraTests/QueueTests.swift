//
//  QueueTests.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import XCTest
@testable import SLAMCamera

class QueueTests: XCTestCase {
  /// Holds random queue length.
  fileprivate var len: Int!

  /// Holds random queue length.
  fileprivate var num: Int!

  /// Holds the reference to the testee.
  fileprivate var que: Queue<Int>!
  
  /// Sets up.
  override func setUp() {
    super.setUp()
    self.len = Int.random(in: 0..<1000)
    self.num = Int.random(in: 0..<10000)
    self.que = Queue<Int>(capacity: self.len)
  }

  /// Tests if the initializer works properly.
  func testInit() throws {
    XCTAssertTrue(self.que.isEmpty())
    XCTAssertEqual(self.que.getLength(), 0)
    XCTAssertNil(self.que.pop())
    XCTAssertNil(self.que.peep())
    XCTAssertNil(self.que.peep(Queue.PeepType.TAIL))
  }
  
  /// Tests if the push works properly.
  func testPush() throws {
    for i in 0..<num {
      self.que.push(i)
    }
    XCTAssertEqual(self.que.getLength(), min(len, num))
    if num > 0 {
      XCTAssertEqual(self.que.peep(), 0)
      XCTAssertEqual(self.que.peep(Queue.PeepType.TAIL), num - 1)
    }
  }

  /// Tests if the pop works properly.
  func testPop() throws {
    for i in 0..<num {
      self.que.push(i)
    }
    for i in 0..<min(len, num) {
      XCTAssertEqual(self.que.pop(), i)
    }
    XCTAssertNil(self.que.pop())
  }
}
