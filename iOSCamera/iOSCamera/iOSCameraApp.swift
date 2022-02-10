//
//  iOSCameraApp.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

// swiftlint:disable type_name
@main
struct iOSCameraApp: App {
  // MARK: Body

  var body: some Scene {
    WindowGroup {
      WebRTCView()
    }
  }
}
