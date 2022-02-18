//
//  IceCandidate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

struct IceCandidate: Codable {
  let candidate: String

  let sdpMLineIndex: Int32

  let sdpMid: String?
    
  init(from iceCandidate: RTCIceCandidate) {
    self.sdpMLineIndex = iceCandidate.sdpMLineIndex
    self.sdpMid = iceCandidate.sdpMid
    self.candidate = iceCandidate.sdp
  }
    
  var rtcIceCandidate: RTCIceCandidate {
    return RTCIceCandidate(
      sdp: self.candidate,
      sdpMLineIndex: self.sdpMLineIndex,
      sdpMid: self.sdpMid)
  }
}
