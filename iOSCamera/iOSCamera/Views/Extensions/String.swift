//
//  Regex.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/15.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension String {
  // MARK: Properties

  enum ValidityType {
    case URL
  }

  enum Regex: String {
    // swiftlint:disable line_length
    case URL =
          "(([^/:.[:space:]]+(.[^/:.[:space:]]+)*)|([0-9](.[0-9]{3})))(:[0-9]+)?((/[^?#[:space:]]+)([^#[:space:]]+)?(#.+)?)?"
  }
  
  // MARK: Methods

  func isValid(_ validityType: ValidityType) -> Bool {
    var regex = ""
    switch validityType {
    case .URL:
      regex = Regex.URL.rawValue
    }
    return NSPredicate(format: "SELF MATCHES %@", regex).evaluate(with: self)
  }
}
