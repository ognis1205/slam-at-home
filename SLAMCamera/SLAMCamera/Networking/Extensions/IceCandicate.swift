//
//  IceCandicate.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/31.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import WebRTC

public struct IceCandidate: Codable {
  /// SDP-ized form of the candidate.
  public let sdp: String

  /// This indicates the index (starting at zero) of m-line in the SDP.
  public let sdpMLineIndex: Int32

  /// If present, this contains the identifier of the "media stream identification" as defined in [RFC 3388].
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
