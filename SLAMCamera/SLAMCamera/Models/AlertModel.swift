//
//  Alert.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation

public class AlertModel {
  /// The alert title.
  private(set) var title: String = ""

  /// The alert message.
  private(set) var message: String = ""

  /// The alert primary button.
  private(set) var primaryButtonTitle = "Accept"

  /// The alert secondary button.
  private(set) var secondaryButtonTitle: String?

  /// Primary button event handler.
  private(set) var primaryAction: (() -> ())?

  /// Secondary button event handler.
  private(set) var secondaryAction: (() -> ())?

  /// Initializer.
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
