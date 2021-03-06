//
//  SessionDescription.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

enum SdpType: String, Codable {
  case offer
  case prAnswer
  case answer
    
  var rtcSdpType: RTCSdpType {
    switch self {
    case .offer:
      return .offer
    case .answer:
      return .answer
    case .prAnswer:
      return .prAnswer
    }
  }
}

struct SessionDescription: Codable {
  let sdp: String

  let type: SdpType
    
  init(from rtcSessionDescription: RTCSessionDescription) {
    self.sdp = rtcSessionDescription.sdp
    switch rtcSessionDescription.type {
    case .offer:
      self.type = .offer
    case .prAnswer:
      self.type = .prAnswer
    case .answer:
      self.type = .answer
    @unknown default:
      fatalError("Unknown RTCSessionDescription type: \(rtcSessionDescription.type.rawValue)")
    }
  }
    
  var rtcSessionDescription: RTCSessionDescription {
    return RTCSessionDescription(type: self.type.rtcSdpType, sdp: self.sdp)
  }
}
