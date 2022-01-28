//
//  WebRTCModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/27.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

class WebRTCModel: NSObject, ObservableObject, WebRTCSignaling {
  @Published var showAlert: Bool = false
  
  @Published var status: String = "disconnected"
  
  @Published var isConnected: Bool = false
  
  @Published var hasRemoteSdp: Bool = false
  
  @Published var numberOfLocalCandidate: Int = 0
  
  @Published var numberOfRemoteCandidate: Int = 0
  
  var alertModel: AlertModel?

  var signal: WebRTCSignal?

  var client: WebRTCClient?
  
  var URL: URL?
}
