//
//  Alert.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//

import Foundation

public class AlertModel {
  private(set) var title: String = ""

  private(set) var message: String = ""

  private(set) var primaryButtonTitle: String = "Accept"

  private(set) var secondaryButtonTitle: String?

  private(set) var primaryAction: (() -> ())?

  private(set) var secondaryAction: (() -> ())?

  public init(
    title: String = "",
    message: String = "",
    primaryButtonTitle: String = "Accept",
    secondaryButtonTitle: String? = nil,
    primaryAction: (() -> ())? = nil,
    secondaryAction: (() -> ())? = nil
  ) {
    self.title = title
    self.message = message
    self.primaryAction = primaryAction
    self.primaryButtonTitle = primaryButtonTitle
    self.secondaryAction = secondaryAction
  }
}
