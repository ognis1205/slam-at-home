//
//  WebRTCConstants.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/28.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

struct WebRTCConstants {
  static let ICE_SERVERS: [String] = [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
    "stun:stun3.l.google.com:19302",
    "stun:stun4.l.google.com:19302"
  ]
  
  static let SIGNALING_ENDPOINT: String = "ws://%@/connect?id=%@"

  static let CAMERA_RESOLUTION: (height: Int, width: Int) = (height: 480, width: 640)

  static let FPS: Int = 3
}
