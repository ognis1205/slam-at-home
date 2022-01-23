//
//  IPTests.swift
//  iOSCameraTests
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

@testable import iOSCamera
import XCTest

class IPTests: XCTestCase {
  fileprivate let IP_REGEX = """
^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}\
([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$
"""

  func testGetAddress() throws {
    guard let regex = try? NSRegularExpression(pattern: IP_REGEX) else { return }
    if let addr = IP.getAddress() {
      XCTAssertNotNil(addr)
      XCTAssertFalse(
        regex.matches(
          in: addr,
          range: NSRange(location: 0, length: addr.count)
        ).isEmpty
      )
    } else {
      
    }
  }
}
