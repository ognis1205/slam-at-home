//
//  IceCandidate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

public struct IceCandidate: Codable {
  public let sdp: String

  public let sdpMLineIndex: Int32

  public let sdpMid: String?
    
  init(from iceCandidate: RTCIceCandidate) {
    self.sdpMLineIndex = iceCandidate.sdpMLineIndex
    self.sdpMid = iceCandidate.sdpMid
    self.sdp = iceCandidate.sdp
  }
    
  var rtcIceCandidate: RTCIceCandidate {
    return RTCIceCandidate(
      sdp: self.sdp,
      sdpMLineIndex: self.sdpMLineIndex,
      sdpMid: self.sdpMid)
  }
}
