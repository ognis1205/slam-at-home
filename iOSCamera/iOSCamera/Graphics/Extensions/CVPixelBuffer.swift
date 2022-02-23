//
//  CVPixelBuffer.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/21.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Accelerate
import CoreImage
import Foundation

public func createPixelBuffer(
  width: Int,
  height: Int
) -> CVPixelBuffer? {
  var pixelBuffer: CVPixelBuffer?
  let status = CVPixelBufferCreate(
    nil,
    width,
    height,
    kCVPixelFormatType_32BGRA,
    nil,
    &pixelBuffer)
  if status != kCVReturnSuccess {
    print("Error: could not create resized pixel buffer...", status)
    return nil
  }
  return pixelBuffer
}

extension CVPixelBuffer {
  func resize(
    cropX: Int,
    cropY: Int,
    cropWidth: Int,
    cropHeight: Int,
    scaleWidth: Int,
    scaleHeight: Int
  ) -> CVPixelBuffer? {
    CVPixelBufferLockBaseAddress(
      self,
      CVPixelBufferLockFlags(rawValue: 0))

    guard
      let srcData = CVPixelBufferGetBaseAddress(self)
    else {
      print("Error: could not get pixel buffer base address...")
      return nil
    }

    let srcBytesPerRow = CVPixelBufferGetBytesPerRow(self)
    let offset = cropY * srcBytesPerRow + cropX * 4
    var srcBuffer = vImage_Buffer(
      data: srcData.advanced(by: offset),
      height: vImagePixelCount(cropHeight),
      width: vImagePixelCount(cropWidth),
      rowBytes: srcBytesPerRow)

    let destBytesPerRow = scaleWidth * 4
    guard
      let destData = malloc(scaleHeight * destBytesPerRow)
    else {
      print("Error: out of memory...")
      return nil
    }

    var destBuffer = vImage_Buffer(
      data: destData,
      height: vImagePixelCount(scaleHeight),
      width: vImagePixelCount(scaleWidth),
      rowBytes: destBytesPerRow)

    let error = vImageScale_ARGB8888(
      &srcBuffer,
      &destBuffer,
      nil,
      vImage_Flags(0))

    CVPixelBufferUnlockBaseAddress(
      self,
      CVPixelBufferLockFlags(rawValue: 0))

    if error != kvImageNoError {
      print("Error: \(error)...")
      free(destData)
      return nil
    }

    let releaseCallback: CVPixelBufferReleaseBytesCallback = { _, ptr in
      if let ptr = ptr {
        free(UnsafeMutableRawPointer(mutating: ptr))
      }
    }

    let pixelFormat = CVPixelBufferGetPixelFormatType(self)
    var dstPixelBuffer: CVPixelBuffer?
    let status = CVPixelBufferCreateWithBytes(
      nil,
      scaleWidth,
      scaleHeight,
      pixelFormat,
      destData,
      destBytesPerRow,
      releaseCallback,
      nil,
      nil,
      &dstPixelBuffer)

    if status != kCVReturnSuccess {
      print("Error: could not create new pixel buffer...")
      free(destData)
      return nil
    }

    return dstPixelBuffer
  }
  
  public func resize(
    width: Int,
    height: Int
  ) -> CVPixelBuffer? {
    return resize(
      cropX: 0,
      cropY: 0,
      cropWidth: CVPixelBufferGetWidth(self),
      cropHeight: CVPixelBufferGetHeight(self),
      scaleWidth: width,
      scaleHeight: height)
  }

  public func resize(
    width: Int,
    height: Int,
    output: CVPixelBuffer,
    context: CIContext
  ) {
    let ciImage = CIImage(cvPixelBuffer: self)
    let sx = CGFloat(width) / CGFloat(CVPixelBufferGetWidth(self))
    let sy = CGFloat(height) / CGFloat(CVPixelBufferGetHeight(self))
    let scaleTransform = CGAffineTransform(scaleX: sx, y: sy)
    let scaledImage = ciImage.transformed(by: scaleTransform)
    context.render(scaledImage, to: output)
  }
}
