//
//  RTCStates.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

extension RTCIceConnectionState: CustomStringConvertible {
  public var description: String {
    switch self {
    case .new:
      return "new"
    case .checking:
      return "checking"
    case .connected:
      return "connected"
    case .completed:
      return "completed"
    case .failed:
      return "failed"
    case .disconnected:
      return "disconnected"
    case .closed:
      return "closed"
    case .count:
      return "count"
    @unknown default:
      return "unknown \(self.rawValue)"
    }
  }
}

extension RTCSignalingState: CustomStringConvertible {
  public var description: String {
    switch self {
    case .stable:
      return "stable"
    case .haveLocalOffer:
      return "have local offer"
    case .haveLocalPrAnswer:
      return "have local pranswer"
    case .haveRemoteOffer:
      return "have remote offer"
    case .haveRemotePrAnswer:
      return "have remote pranswer"
    case .closed:
      return "closed"
    @unknown default:
      return "unknown \(self.rawValue)"
    }
  }
}

extension RTCIceGatheringState: CustomStringConvertible {
  public var description: String {
    switch self {
    case .new:
      return "new"
    case .gathering:
      return "gathering"
    case .complete:
      return "complete"
    @unknown default:
      return "unknown \(self.rawValue)"
    }
  }
}

extension RTCDataChannelState: CustomStringConvertible {
  public var description: String {
    switch self {
    case .connecting:
      return "connecting"
    case .open:
      return "open"
    case .closing:
      return "closing"
    case .closed:
      return "closed"
    @unknown default:
      return "unknown \(self.rawValue)"
    }
  }
}
