//
//  UIImage.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/22.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import CoreGraphics
import CoreImage
import Foundation
import VideoToolbox

extension UIImage {
  var pixelBuffer: CVPixelBuffer? {
    return getPixelBuffer()
  }
  
  public convenience init?(pixelBuffer: CVPixelBuffer) {
    var cgImage: CGImage?
    VTCreateCGImageFromCVPixelBuffer(pixelBuffer, options: nil, imageOut: &cgImage)
    guard let cgImage = cgImage else {
      return nil
    }
    self.init(cgImage: cgImage)
  }

  func getPixelBuffer() -> CVPixelBuffer? {
    var pixelBuffer: CVPixelBuffer?

    #if arch(arm64)
      let attrs = [
        kCVPixelBufferMetalCompatibilityKey: kCFBooleanTrue,
        kCVPixelBufferCGImageCompatibilityKey: kCFBooleanTrue,
        kCVPixelBufferCGBitmapContextCompatibilityKey: kCFBooleanTrue] as CFDictionary
    #else
      // TODO: resolve OpenGL compatibility
      #error("This project must target ONLY arm64 so far")
//      let attrs = [
//        kCVPixelBufferOpenGLCompatibilityKey: kCFBooleanTrue,
//        kCVPixelBufferCGImageCompatibilityKey: kCFBooleanTrue,
//        kCVPixelBufferCGBitmapContextCompatibilityKey: kCFBooleanTrue] as CFDictionary
    #endif

    let status = CVPixelBufferCreate(
      kCFAllocatorDefault,
      Int(self.size.width),
      Int(self.size.height),
      kCVPixelFormatType_32ARGB,
      attrs,
      &pixelBuffer)

    guard
      status == kCVReturnSuccess
    else {
      return nil
    }
    
    guard
      let pixelBuffer = pixelBuffer
    else {
      return nil
    }

    CVPixelBufferLockBaseAddress(
      pixelBuffer,
      CVPixelBufferLockFlags(rawValue: 0))

    let pixelData = CVPixelBufferGetBaseAddress(pixelBuffer)

    let rgbColorSpace = CGColorSpaceCreateDeviceRGB()
    let context = CGContext(
      data: pixelData,
      width: Int(self.size.width),
      height: Int(self.size.height),
      bitsPerComponent: 8,
      bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer),
      space: rgbColorSpace,
      bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)
    context?.translateBy(x: 0, y: self.size.height)
    context?.scaleBy(x: 1.0, y: -1.0)
    
    guard
      let context = context
    else {
      return nil
    }

    UIGraphicsPushContext(context)
    self.draw(
      in: CGRect(x: 0, y: 0, width: self.size.width, height: self.size.height))
    UIGraphicsPopContext()

    CVPixelBufferUnlockBaseAddress(
      pixelBuffer,
      CVPixelBufferLockFlags(rawValue: 0))

    return pixelBuffer
  }
}
