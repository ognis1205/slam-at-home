//
//  WebRTCVideoView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/12.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct WebRTCVideoView: UIViewRepresentable {
  // MARK: Properties

  var model: WebRTCModel
  
  // MARK: Methods

  func makeUIView(context: Context) -> RTCCameraPreviewView {
    let view = RTCCameraPreviewView()
    let bounds = view.bounds
    view.captureSession = model.capture.session
//    view.captureSession = (model.videoTrack.source as! RTCAVFoundationVideoSource).AVCaptureSession
//    view.captureSession = model.client.videoTrack.sender.AVCaptureSession
    view.backgroundColor = .black
    view.layer.cornerRadius = 0
    view.layer.position = CGPoint(
      x: bounds.midX,
      y: bounds.midY)
    view.layer.bounds = CGRect(
      origin: CGPoint.zero,
      size: CGSize(width: bounds.width, height: bounds.height))
    (view.layer as! AVCaptureVideoPreviewLayer).videoGravity = .resize
    (view.layer as! AVCaptureVideoPreviewLayer).connection?.videoOrientation = .portrait
    debugPrint((view.layer as! AVCaptureVideoPreviewLayer).videoGravity)
//    previewLayer.videoGravity = .resize
//    previewLayer.connection?.videoOrientation = .portrait
    return view
  }

  func updateUIView(_ uiView: RTCCameraPreviewView, context: Context) {
    // Placeholder.
  }
}

struct WebRTCVideoView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCVideoView(model: WebRTCModel())
  }
}

