//
//  iOSCameraApp.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

class AppDelegate: NSObject, UIApplicationDelegate {
  // MARK: Properties
        
  static var orientationLock = UIInterfaceOrientationMask.portrait
  
  // MARK: Methods

  func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    return AppDelegate.orientationLock
  }
}

// swiftlint:disable type_name
@main
struct iOSCameraApp: App {
  // MARK: Properties

  @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

  // MARK: Body

  var body: some Scene {
    WindowGroup {
      WebRTCView()
    }
  }
}
