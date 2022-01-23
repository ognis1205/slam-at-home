//
//  iOSCameraUITests.swift
//  iOSCameraUITests
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import XCTest

// swiftlint:disable type_name
class iOSCameraUITests: XCTestCase {
  // swiftlint:disable overridden_super_call
  override func setUpWithError() throws {
    continueAfterFailure = false
  }

  // swiftlint:disable overridden_super_call
  override func tearDownWithError() throws {
  }

  func testExample() throws {
    let app = XCUIApplication()
    app.launch()
  }

  func testLaunchPerformance() throws {
    if #available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 7.0, *) {
      measure(metrics: [XCTApplicationLaunchMetric()]) {
        XCUIApplication().launch()
      }
    }
  }
}
