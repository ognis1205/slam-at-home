//
//  WebRTCViewModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import SwiftUI

class WebRTCViewModel: ObservableObject {
  @Published var isConnected: Bool = false

  @Published var status: String = "disconnected"

  @Published var hasRemoteSdp: Bool = false
    
  @Published var numberOfLocalCandidate: Int = 0
    
  @Published var numberOfRemoteCandidate: Int = 0
  
  @Published var showAlert: Bool = false
    
  var alert: AlertModel?
  
  var model: WebRTCModel = WebRTCModel()

  var dialog: Alert {
    return Alert(
      title: Text(self.alert?.title ?? ""),
      message: Text(self.alert?.message ?? ""),
      dismissButton: .default(
        Text(self.alert?.primaryButtonTitle ?? ""),
        action: { self.alert?.primaryAction?() }
      )
    )
  }

  init() {
    self.model.delegate = self
    self.model.ready()
  }
  
  func start() {
//    self.model.delegate = self
//    self.model.start()
  }
}
