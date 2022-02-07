//
//  HLSVideoView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import SwiftUI

struct HLSVideoView: UIViewRepresentable {
  class Wrapper: UIView {
    override public class var layerClass: AnyClass {
      AVCaptureVideoPreviewLayer.self
    }
        
    var avCaptureVideoPreviewLayer: AVCaptureVideoPreviewLayer {
      return layer as! AVCaptureVideoPreviewLayer
    }
  }

  var model: HLSModel

  func makeUIView(context: Context) -> Wrapper {
    let view = Wrapper()
    let bounds = view.bounds
    view.backgroundColor = .black
    view.avCaptureVideoPreviewLayer.session = model.capture.session
    view.avCaptureVideoPreviewLayer.cornerRadius = 0
    view.avCaptureVideoPreviewLayer.position = CGPoint(
      x: bounds.midX,
      y: bounds.midY)
    view.avCaptureVideoPreviewLayer.bounds = CGRect(
      origin: CGPoint.zero,
      size: CGSize(width: bounds.width, height: bounds.height))
    view.avCaptureVideoPreviewLayer.videoGravity = .resize
    view.avCaptureVideoPreviewLayer.connection?.videoOrientation = .portrait
    return view
  }

  func updateUIView(_ uiView: Wrapper, context: Context) {
    // Placeholder.
  }
}

struct HLSVideoView_Previews: PreviewProvider {
  static var previews: some View {
    HLSVideoView(model: HLSModel())
  }
}
