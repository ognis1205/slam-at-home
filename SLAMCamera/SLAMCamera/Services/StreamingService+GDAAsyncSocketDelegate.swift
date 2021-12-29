//
//  StreamingService.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation
import AVFoundation
import CocoaAsyncSocket

extension StreamingService: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(
    _ output: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from connection: AVCaptureConnection
  ) {
    if !self.connections.isEmpty {
      guard let buffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
      let capturedImage = CIImage(cvImageBuffer: buffer, options: nil)
      guard let image = self.context.createCGImage(capturedImage, from: capturedImage.extent) else { return }
      let jpeg = UIImage(cgImage: image).jpegData(compressionQuality: 0)

      for (key, connection) in self.connections {
        if connection.isConnected {
          connection.dataToSend = (jpeg as NSData?)?.copy() as? Data
        } else {
          self.connections.removeValue(forKey: key)
        }
      }

      if self.connections.isEmpty {
        print("EMPTY")
        DispatchQueue.main.async(execute: {
          self.isConnected = false
        })
      }
    }
  }
}

