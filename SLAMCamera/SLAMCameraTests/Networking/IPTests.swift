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
  /// IP address regex.
  fileprivate let IP_REGEX = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"

  /// Tests if the getAddress works properly.
  func testGetAddress() throws {
    guard let regex = try? NSRegularExpression(pattern: IP_REGEX) else { return }
    let addr = IP.getAddress()!
    XCTAssertNotNil(addr)
    XCTAssertTrue(
      regex.matches(
        in: addr,
        range: NSRange(location: 0, length: addr.count)
      ).count > 0
    )
  }
}
