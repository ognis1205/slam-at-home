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
  public func capturer(_ capturer: RTCVideoCapturer, didCapture frame: RTCVideoFrame) {
    self.videoSource.capturer(capturer, didCapture: frame)
  }
}
