//
//  WebRTCModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/27.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

public class WebRTCModel: NSObject, ObservableObject, WebRTCSignaling {
  @Published public var showAlert: Bool = false
  
  @Published public var status: String = "disconnected"
  
  @Published public var isConnected: Bool = false
  
  @Published public var hasRemoteSdp: Bool = false
  
  @Published public var numberOfLocalCandidate: Int = 0
  
  @Published public var numberOfRemoteCandidate: Int = 0
  
  public var alertModel: AlertModel?

  public var signal: WebRTCSignal?

  public var client: WebRTCClient?
  
  public var URL: URL?
}
