//
//  WebRTCStreamingService.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/17.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//
import Foundation
import AVFoundation
import CocoaAsyncSocket

extension WebRTCStreamingService: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(
    _ output: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from connection: AVCaptureConnection
  ) -> Void {
    // Placeholder.
  }
}

