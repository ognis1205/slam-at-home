//
//  IPTests.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import XCTest
@testable import SLAMCamera

class IPTests: XCTestCase {
  /// Tests if the initializer works properly.
  func testGetAddress() throws {
    print(IP.getAddress()!)
  }
}
