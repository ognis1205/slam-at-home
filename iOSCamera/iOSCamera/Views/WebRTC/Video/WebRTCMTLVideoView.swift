//
//  WebRTCMTLVideoView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/08.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct WebRTCMTLVideoView: UIViewRepresentable, Debuggable {
  // MARK: Properties

  var model: WebRTCModel
  
  // MARK: Methods

  func makeUIView(context: Context) -> RTCMTLVideoView {
    let view = RTCMTLVideoView(frame: CGRect.zero)
    view.contentMode = .scaleAspectFill
    if let device = self.model.capture.device {
      self.info("found metal video device...")
      self.model.capture.state(.running)
      self.model.client.capture(renderer: view, videoDevice: device)
    }
    return view
  }
  
  func updateUIView(_ uiView: RTCMTLVideoView, context: Context) {
    // Placeholder.
  }
}

struct WebRTCMTLVideoView_Preview: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCMTLVideoView(model: WebRTCModel())
  }
}
