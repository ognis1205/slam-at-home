//
//  Preview.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/28.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import SwiftUI
import AVFoundation

struct Preview: UIViewRepresentable {
  /// UIView wrapper of `AVCaptureVideoPreviewLayer`.
  class PreviewView: UIView {
    override class var layerClass: AnyClass {
      AVCaptureVideoPreviewLayer.self
    }
        
    var avPreviewLayer: AVCaptureVideoPreviewLayer {
      return layer as! AVCaptureVideoPreviewLayer
    }
  }

  /// Reference to the `AVCaptureSession` of `StreamingService`.
  let session: AVCaptureSession

  /// Make `UIView`.
  func makeUIView(context: Context) -> PreviewView {
    let view = PreviewView()
    let bounds = view.bounds
    view.backgroundColor = .black
    view.avPreviewLayer.session = session
    view.avPreviewLayer.cornerRadius = 0
    view.avPreviewLayer.position = CGPoint(
      x: bounds.midX,
      y: bounds.midY)
    view.avPreviewLayer.bounds = CGRect(
      origin: CGPoint.zero,
      size: CGSize(width: bounds.width, height: bounds.height))
    view.avPreviewLayer.videoGravity = .resize
    view.avPreviewLayer.connection?.videoOrientation = .portrait
    return view
  }

  // Update `UIView`.
  func updateUIView(_ uiView: PreviewView, context: Context) {
    // Placeholder.
  }
}

struct CameraPreview_Previews: PreviewProvider {
  static var previews: some View {
    Preview(session: AVCaptureSession())
              //.frame(height: 300)
  }
}
