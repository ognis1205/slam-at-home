//
//  AlertReporting.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

protocol AlertReportingDelegate: AnyObject {
  func alert(_ alert: AlertModel)
}

protocol AlertReporting: AnyObject {
  func alert(
    _ delegate: AlertReportingDelegate,
    title: String,
    message: String,
    primaryButtonTitle: String,
    secondaryButtonTitle: String?,
    primaryAction: (() -> Void)?,
    secondaryAction: (() -> Void)?
  )
}

extension AlertReporting {
  func alert(
    _ delegate: AlertReportingDelegate,
    title: String = "",
    message: String = "",
    primaryButtonTitle: String = "Accept",
    secondaryButtonTitle: String? = nil,
    primaryAction: (() -> Void)? = nil,
    secondaryAction: (() -> Void)? = nil
  ) {
    delegate.alert(AlertModel(
      title: title,
      message: message,
      primaryButtonTitle: primaryButtonTitle,
      secondaryButtonTitle: secondaryButtonTitle,
      primaryAction: primaryAction,
      secondaryAction: secondaryAction))
  }
}
