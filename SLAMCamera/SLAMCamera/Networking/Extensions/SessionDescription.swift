//
//  SessionDescription.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/31.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import WebRTC

public enum SdpType: String, Codable {
  /// The description is the initial proposal in an offer/answer exchange.
  case offer

  /// The description is a provisional answer and may be changed when the definitive choice will be given.
  case prAnswer

  /// The description is the definitive choice in an offer/answer exchange.
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
  /// SDP-ized form of the candidate.
  public let sdp: String

  /// Corresponding SDP type.
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
