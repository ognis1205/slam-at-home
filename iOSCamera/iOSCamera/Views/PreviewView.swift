//
//  Preview.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/28.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import AVFoundation

public struct PreviewView: UIViewRepresentable {
  /// UIView wrapper of `AVCaptureVideoPreviewLayer`.
  public class Wrapper: UIView {
    override public class var layerClass: AnyClass {
      AVCaptureVideoPreviewLayer.self
    }
        
    var avPreviewLayer: AVCaptureVideoPreviewLayer {
      return layer as! AVCaptureVideoPreviewLayer
    }
  }

  /// Reference to the `AVCaptureSession` of `StreamingService`.
  public let avCaptureSession: AVCaptureSession

  /// Make `UIView`
  public func makeUIView(context: Context) -> Wrapper {
    let view = Wrapper()
    let bounds = view.bounds
    view.backgroundColor = .black
    view.avPreviewLayer.session = avCaptureSession
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
  public func updateUIView(_ uiView: Wrapper, context: Context) -> Void {
    // Placeholder.
  }
}

public struct PreviewView_Previews: PreviewProvider {
  public static var previews: some View {
    PreviewView(avCaptureSession: AVCaptureSession())
  }
}
