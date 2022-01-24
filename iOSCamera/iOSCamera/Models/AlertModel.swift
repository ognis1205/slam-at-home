//
//  AlertModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

public class AlertModel {
  private(set) var title: String = ""

  private(set) var message: String = ""

  private(set) var primaryButtonTitle: String = "Accept"

  private(set) var secondaryButtonTitle: String?

  private(set) var primaryAction: (() -> Void)?

  private(set) var secondaryAction: (() -> Void)?

  public init(
    title: String = "",
    message: String = "",
    primaryButtonTitle: String = "Accept",
    secondaryButtonTitle: String? = nil,
    primaryAction: (() -> Void)? = nil,
    secondaryAction: (() -> Void)? = nil
  ) {
    self.title = title
    self.message = message
    self.primaryAction = primaryAction
    self.primaryButtonTitle = primaryButtonTitle
    self.secondaryAction = secondaryAction
  }
}
