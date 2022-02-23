//
//  MetalColorMapApplier.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import CoreMedia
import CoreVideo
import MetalKit

class MetalColorMapApplier: ColorMapApplier {
  // MARK: Properties
  
  private let colors = 256

  private let bytesPerPixel = 8

  var isPrepared: Bool = false
  
  private(set) var filter: ColorFilter?
  
  private let device: MTLDevice? = MTLCreateSystemDefaultDevice()
  
  private var buffer: MTLBuffer?
    
  private var state: MTLComputePipelineState?

  private lazy var queue: MTLCommandQueue? = {
    return self.device?.makeCommandQueue()
  }()

  // MARK: Init
  required init() {
    guard
      let defaultLibrary = self.device?.makeDefaultLibrary(),
      let kernelFunction = defaultLibrary.makeFunction(name: "depthToColorMap")
    else {
      fatalError("Unable to create depth converter pipeline state.")
    }
    do {
      self.state = try self.device?.makeComputePipelineState(
        function: kernelFunction)
    } catch {
      fatalError("Unable to create depth converter pipeline state. (\(error))")
    }
  }
    
  func prepare(filter: ColorFilter) {
    guard
      let device = self.device
    else {
      return
    }
    guard
      self.filter != filter
    else {
      return
    }
    self.reset()
    if filter != .none {
      let colorTable = ColorTable(
        metalDevice: device,
        colors: filter.colors)
      self.buffer = colorTable.get()
    }
    self.isPrepared = true
    self.filter = filter
  }
    
  func reset() {
    self.buffer = nil
    self.isPrepared = false
  }
    
  func render(image: CGImage) -> CGImage? {
    if !self.isPrepared {
      assertionFailure("Invalid state: Not prepared")
      return nil
    }

    guard
      let filter = self.filter
    else {
      return image
    }
    guard
      filter != .none
    else {
      return image
    }
        
    guard
      let outputTexture = texture(
        pixelFormat: .bgra8Unorm,
        width: image.width,
        height: image.height),
      let inputTexture = self.texture(from: image)
    else {
      return nil
    }
        
    guard
      let queue = self.queue,
      let buffer = queue.makeCommandBuffer(),
      let encoder = buffer.makeComputeCommandEncoder()
    else {
      print("Failed to create Metal command queue")
      return nil
    }

    encoder.label = "Depth to Colormap"
    guard
      let state = self.state
    else {
      print("Failed to acquire Metal command state")
      return nil
    }
    encoder.setComputePipelineState(state)
    encoder.setTexture(inputTexture, index: 0)
    encoder.setTexture(outputTexture, index: 1)

    if filter != .none {
      encoder.setBuffer(self.buffer, offset: 0, index: 3)
    }

    let width = state.threadExecutionWidth
    let height = state.maxTotalThreadsPerThreadgroup / width
    let threadsPerThreadgroup = MTLSizeMake(width, height, 1)
    let threadgroupsPerGrid = MTLSize(
      width: (inputTexture.width + width - 1) / width,
      height: (inputTexture.height + height - 1) / height,
      depth: 1)
    encoder.dispatchThreadgroups(
      threadgroupsPerGrid,
      threadsPerThreadgroup: threadsPerThreadgroup)
    encoder.endEncoding()
    buffer.commit()

    return cgImage(from: outputTexture)
  }
    
  private func cgImage(from texture: MTLTexture) -> CGImage? {
    // The total number of bytes of the texture
    let imageByteCount = texture.width * texture.height * self.bytesPerPixel
    // The number of bytes for each image row
    let bytesPerRow = texture.width * self.bytesPerPixel
    // An empty buffer that will contain the image
    var src = [UInt8](repeating: 0, count: Int(imageByteCount))
    // Gets the bytes from the texture
    let region = MTLRegionMake2D(0, 0, texture.width, texture.height)
    texture.getBytes(&src, bytesPerRow: bytesPerRow, from: region, mipmapLevel: 0)
    // Creates an image context
    let bitmapInfo = CGBitmapInfo(
      rawValue: (CGBitmapInfo.byteOrder32Big.rawValue | CGImageAlphaInfo.premultipliedLast.rawValue))
    let bitsPerComponent = 8
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let context = CGContext(
      data: &src,
      width: texture.width,
      height: texture.height,
      bitsPerComponent: bitsPerComponent,
      bytesPerRow: bytesPerRow,
      space: colorSpace,
      bitmapInfo: bitmapInfo.rawValue)
    // Creates the image from the graphics context
    let dstImage = context?.makeImage()
    // Creates the final UIImage
    return dstImage
  }

  private func texture(from image: CGImage) -> MTLTexture? {
    guard
      let device = self.device
    else {
      return nil
    }
    let textureLoader = MTKTextureLoader(device: device)
    do {
      let textureOut = try textureLoader.newTexture(cgImage: image)
      return textureOut
    } catch {
      return nil
    }
  }

  private func texture(
    pixelFormat: MTLPixelFormat,
    width: Int,
    height: Int
  ) -> MTLTexture? {
    let textureDescriptor = MTLTextureDescriptor.texture2DDescriptor(
      pixelFormat: pixelFormat,
      width: width,
      height: height,
      mipmapped: false)
    textureDescriptor.usage = [.shaderRead, .shaderWrite]
    return self.device?.makeTexture(descriptor: textureDescriptor)
  }
}
