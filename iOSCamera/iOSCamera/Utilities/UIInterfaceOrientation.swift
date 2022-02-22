//
//  UIInterfaceOrientation.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/12.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import Foundation

extension UIInterfaceOrientation {
  // MARK: Properties

  var videoOrientation: AVCaptureVideoOrientation? {
    switch self {
    case .portraitUpsideDown: return .landscapeRight
    case .landscapeRight: return .landscapeRight
    case .landscapeLeft: return .landscapeRight
    case .portrait: return .landscapeRight
    default: return nil
    }
  }
}
