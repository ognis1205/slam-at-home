//
//  HLSModel+VideoCapturing.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import CocoaAsyncSocket
import Foundation

extension HLSModel: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(
    _ output: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from connection: AVCaptureConnection
  ) {
    if !self.streams.isEmpty {
      guard let buffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
      let capturedImage = CIImage(cvImageBuffer: buffer, options: nil)
      guard
        let image = self.videoCapturingContext.ciContext.createCGImage(
        capturedImage,
        from: capturedImage.extent)
      else {
          return
      }
      let jpeg = UIImage(cgImage: image).jpegData(compressionQuality: 0)

      for (key, stream) in self.streams {
        if stream.isConnected {
          stream.dataToSend = (jpeg as NSData?)?.copy() as? Data
        } else {
          debugPrint("Dropping connection [#\(stream.id)]")
          self.streams.removeValue(forKey: key)
        }
      }

      if self.streams.isEmpty {
        DispatchQueue.main.async(execute: {
          self.isConnected = false
        })
      }
    }
  }
}
