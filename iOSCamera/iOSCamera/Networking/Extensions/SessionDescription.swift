//
//  SessionDescription.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2021/12/31.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

public enum SdpType: String, Codable {
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

public struct SessionDescription: Codable {
  public let sdp: String

  public let type: SdpType
    
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
