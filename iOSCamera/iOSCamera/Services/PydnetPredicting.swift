//
//  PydnetPredicting.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import CoreML
import Foundation

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

protocol PydnetPredicting {
  // MARK: Methods
  
  func predict(_ input: UIImage, width: Int, height: Int) -> UIImage?
}

extension PydnetPredicting {
  // MARK: Methods
  
  func predict(_ input: UIImage, width: Int, height: Int) -> UIImage? {
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
    return UIImage(pixelBuffer: depth)
  }
}
