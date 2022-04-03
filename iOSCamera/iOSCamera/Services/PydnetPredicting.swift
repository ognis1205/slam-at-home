//
//  PydnetPredicting.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import CoreML
import Foundation
import VideoToolbox

final class PydnetModel {
  // MARK: Properties
  
  static let shared: Pydnet? = try? Pydnet(
    configuration: MLModelConfiguration())

  // MARK: Init

  private init() {
    // Not allowed.
  }
  
  // MARK: Methods
  
  static func predict(_ input: CVPixelBuffer) -> CVPixelBuffer? {
    return try? shared?.prediction(In: input).Out
  }
}

final class MetalColorMap {
  // MARK: Properties
  
  static let shared: MetalColorMapApplier = MetalColorMapApplier()

  // MARK: Init

  private init() {
    // Not allowed.
  }
  
  // MARK: Methods
  
  static func apply(_ image: CGImage, filter: ColorFilter) -> CGImage? {
    shared.prepare(filter: filter)
    return shared.render(image: image)
  }
}

final class SharpenFilter {
  // MARK: Properties
  
  static let shared: CIFilter? = CIFilter(name: "CISharpenLuminance")

  // MARK: Init

  private init() {
    // Not allowed.
  }
  
  // MARK: Methods
  
  static func apply(_ image: CGImage, sharpness: Int) -> CGImage? {
    shared?.setValue(CIImage(cgImage: image), forKey: kCIInputImageKey)
    shared?.setValue(sharpness, forKey: kCIInputSharpnessKey)
    guard
      let filtered = shared?.outputImage
    else {
      return nil
    }
    let context = CIContext(options: nil)
    return context.createCGImage(
      filtered,
      from: filtered.extent)
  }
}

protocol PydnetPredicting {
  // MARK: Methods
  
  func predict(_ input: UIImage, width: Int, height: Int) -> UIImage?
}

extension PydnetPredicting {
  // MARK: Methods
  
  func predict(_ input: UIImage, width: Int, height: Int) -> UIImage? {
    var cgImage: CGImage?
    guard
      let buffer = input.pixelBuffer?.resize(
        width: PydnetConstants.INPUT_SHAPE.width,
        height: PydnetConstants.INPUT_SHAPE.height),
      let depth = PydnetModel
        .predict(buffer)?
        .resize(width: width, height: height)
    else {
      return nil
    }
    VTCreateCGImageFromCVPixelBuffer(depth, options: nil, imageOut: &cgImage)
    guard
      let cgImage = cgImage,
      let heat = MetalColorMap.apply(cgImage, filter: .magma)
    else {
      return nil
    }
    return UIImage(cgImage: heat)
  }
}
