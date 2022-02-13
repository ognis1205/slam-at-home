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
    case .portraitUpsideDown: return .portrait
    case .landscapeRight: return .portrait
    case .landscapeLeft: return .portrait
    case .portrait: return .portrait
    default: return nil
    }
  }
}
