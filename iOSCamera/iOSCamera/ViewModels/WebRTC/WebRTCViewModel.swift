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
  
  func start() {
    self.model.delegate = self
    self.model.start()
  }
}
