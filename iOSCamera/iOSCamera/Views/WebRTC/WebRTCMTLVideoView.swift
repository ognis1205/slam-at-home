//
//  WebRTCMTLVideoView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/08.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct WebRTCMTLVideoView: UIViewRepresentable {
  var model: WebRTCModel

  func makeUIView(context: Context) -> RTCMTLVideoView {
    let view = RTCMTLVideoView(frame: CGRect.zero)
    if let device = self.model.capture.device {
      debugPrint("Start capturing on MTL video device")
      self.model.client.capture(renderer: view, videoDevice: device)
    }
    return view
  }
  
  func updateUIView(_ uiView: RTCMTLVideoView, context: Context) {
    // Placeholder.
  }
}

struct WebRTCMTLVideoView_Preview: PreviewProvider {
  static var previews: some View {
    WebRTCMTLVideoView(model: WebRTCModel())
  }
}
