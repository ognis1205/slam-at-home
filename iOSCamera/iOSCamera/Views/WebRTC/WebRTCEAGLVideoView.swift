//
//  WebRTCEAGLVideoCameraView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//

import SwiftUI
import WebRTC

struct WebRTCEAGLVideoView: UIViewRepresentable {
  var model: WebRTCModel

  func makeUIView(context: Context) -> RTCEAGLVideoView {
    let view = RTCEAGLVideoView(frame: CGRect.zero)
    if let device = self.model.capture.device {
      self.model.client.capture(renderer: view, videoDevice: device)
    }
    return view
  }
  
  func updateUIView(_ uiView: RTCEAGLVideoView, context: Context) {
    // Placeholder.
  }
}

struct WebRTCEAGLVideoView_Preview: PreviewProvider {
  static var previews: some View {
    WebRTCEAGLVideoView(
      model: WebRTCModel())
  }
}
