//
//  WebRTCClient+RTCVideoCapturerDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/26.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

import VideoToolbox

extension WebRTCClient: RTCVideoCapturerDelegate {
  // MARK: Methods

  func capturer(_ capturer: RTCVideoCapturer, didCapture frame: RTCVideoFrame) {
    guard
      let newFrame = self.delegate?.webRTC(self, didCapture: frame)
    else {
      self.videoTrack.source.capturer(capturer, didCapture: frame)
      return
    }
    self.videoTrack.source.capturer(capturer, didCapture: newFrame)
  }
}
