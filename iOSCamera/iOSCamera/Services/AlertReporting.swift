//
//  AlertReporting.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/20.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

public protocol AlertReporting {
  var alertModel: AlertModel? { get set }
  
  func reportAlert(
    title: String,
    message: String,
    primaryButtonTitle: String,
    secondaryButtonTitle: String?,
    primaryAction: (() -> ())?,
    secondaryAction: (() -> ())?
  ) -> Void
}

public extension AlertReporting {
  public func reportAlert(
    title: String = "",
    message: String = "",
    primaryButtonTitle: String = "Accept",
    secondaryButtonTitle: String? = nil,
    primaryAction: (() -> ())? = nil,
    secondaryAction: (() -> ())? = nil
  ) -> Void {
    DispatchQueue.main.async {
      self.alertModel = AlertModel(
        title: title,
        message: message,
        primaryButtonTitle: primaryButtonTitle,
        secondaryButtonTitle: secondaryButtonTitle,
        primaryAction: primaryAction,
        secondaryAction: secondaryAction
      )
    }
  }
}
