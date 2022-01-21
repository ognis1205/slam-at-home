//
//  WebRTCProtocol.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/01.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

public protocol WebRTCProtocol: AnyObject {
  /// WebRTC offer call.
  func offer(didComplete: @escaping (_ sdp: RTCSessionDescription) -> Void) -> Void

  /// WebRTC answer call.
  func answer(didComplete: @escaping (_ sdp: RTCSessionDescription) -> Void) -> Void

  /// Sets remote SDP on this client.
  func set(remoteSdp: RTCSessionDescription, didComplete: @escaping (Error?) -> ()) -> Void

  /// Sets remote ICE on this client.
  func set(remoteIce: RTCIceCandidate) -> Void

  /// Sends a data to the partner.
  func send(_ data: Data) -> Void

  /// Streams video on the track.
  func add(renderer: RTCVideoRenderer, videoDevice: AVCaptureDevice) -> Void
}

public protocol WebRTCDelegate: AnyObject {
  /// Called when new local candidate has found.
  func webRTC(_ client: WebRTCProtocol, didDiscoverLocalCandidate candidate: RTCIceCandidate)

  /// Called when connection state has changed.
  func webRTC(_ client: WebRTCProtocol, didChangeConnectionState state: RTCIceConnectionState)

  /// Called when new data has recieved.
  func webRTC(_ client: WebRTCProtocol, didReceiveData data: Data)
}
