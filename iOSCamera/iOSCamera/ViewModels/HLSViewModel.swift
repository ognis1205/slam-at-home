//
//  HLSViewModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import SwiftUI

class HLSViewModel: ObservableObject {
  @Published var isConnected: Bool = false

  @Published var URL: String = "Not Available"

  @Published var showAlert: Bool = false

  var model: HLSModel = HLSModel()

  var label: String {
    return self.isConnected ? "wifi.circle.fill" : "wifi.circle"
  }

  var color: Color {
    return self.isConnected ? .red : .white
  }

  var session: AVCaptureSession {
    return self.model.videoCapture.session
  }
  
  var dialog: Alert {
    return Alert(
      title: Text(self.model.alert?.title ?? ""),
      message: Text(self.model.alert?.message ?? ""),
      dismissButton: .default(
        Text(self.model.alert?.primaryButtonTitle ?? ""),
        action: { self.model.alert?.primaryAction?() }
      )
    )
  }
  
  func start() {
    self.model.delegate = self
    self.model.start()
  }
}
