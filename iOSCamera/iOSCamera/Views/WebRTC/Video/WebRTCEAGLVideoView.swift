//
//  WebRTCEAGLVideoCameraView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct WebRTCEAGLVideoView: UIViewRepresentable, Debuggable {
  // MARK: Properties

  var model: WebRTCModel
  
  // MARK: Methods

  func makeUIView(context: Context) -> RTCEAGLVideoView {
    let view = RTCEAGLVideoView(frame: CGRect.zero)
    view.contentMode = .scaleAspectFill
    if let device = self.model.capture.device {
      self.info("found opengl video device...")
      self.model.capture.state(.running)
      self.model.client.capture(renderer: view, videoDevice: device)
    }
    return view
  }
  
  func updateUIView(_ uiView: RTCEAGLVideoView, context: Context) {
    // Placeholder.
  }
}

struct WebRTCEAGLVideoView_Preview: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCEAGLVideoView(model: WebRTCModel())
  }
}
