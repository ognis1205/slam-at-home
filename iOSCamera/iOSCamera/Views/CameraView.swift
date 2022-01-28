//
//  CameraView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import SwiftUI

struct CameraView: UIViewRepresentable {
  class Wrapper: UIView {
    override public class var layerClass: AnyClass {
      AVCaptureVideoPreviewLayer.self
    }
        
    var avCaptureVideoPreviewLayer: AVCaptureVideoPreviewLayer {
      return layer as! AVCaptureVideoPreviewLayer
    }
  }

  let avCaptureSession: AVCaptureSession

  func makeUIView(context: Context) -> Wrapper {
    let view = Wrapper()
    let bounds = view.bounds
    view.backgroundColor = .black
    view.avCaptureVideoPreviewLayer.session = avCaptureSession
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

struct CameraView_Previews: PreviewProvider {
  static var previews: some View {
    CameraView(avCaptureSession: AVCaptureSession())
  }
}
