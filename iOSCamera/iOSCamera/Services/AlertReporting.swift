//
//  AlertReporting.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

protocol AlertReporting: AnyObject {
  var alertModel: AlertModel? { get set }
  
  var showAlert: Bool { get set }

  func reportAlert(
    title: String,
    message: String,
    primaryButtonTitle: String,
    secondaryButtonTitle: String?,
    primaryAction: (() -> Void)?,
    secondaryAction: (() -> Void)?
  )
}

extension AlertReporting {
  func reportAlert(
    title: String = "",
    message: String = "",
    primaryButtonTitle: String = "Accept",
    secondaryButtonTitle: String? = nil,
    primaryAction: (() -> Void)? = nil,
    secondaryAction: (() -> Void)? = nil
  ) {
    DispatchQueue.main.async {
      self.alertModel = AlertModel(
        title: title,
        message: message,
        primaryButtonTitle: primaryButtonTitle,
        secondaryButtonTitle: secondaryButtonTitle,
        primaryAction: primaryAction,
        secondaryAction: secondaryAction)
      self.showAlert = true
    }
  }
}
