//
//  WebRTCEAGLVideoCameraView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct WebRTCEAGLVideoView: UIViewRepresentable {
  var model: WebRTCModel

  func makeUIView(context: Context) -> RTCEAGLVideoView {
    let view = RTCEAGLVideoView(frame: CGRect.zero)
    if let device = self.model.capture.device {
      debugPrint("Start capturing on EAGL video device")
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
    WebRTCEAGLVideoView(model: WebRTCModel())
  }
}
