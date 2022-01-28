//
//  WebRTCClient+RTCVideoCapturerDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/26.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

extension WebRTCClient: RTCVideoCapturerDelegate {
  func capturer(_ capturer: RTCVideoCapturer, didCapture frame: RTCVideoFrame) {
    self.videoTrack.source.capturer(capturer, didCapture: frame)
  }
}
