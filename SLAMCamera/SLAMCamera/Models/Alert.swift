//
//  Alert.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/24.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import Foundation

public struct Alert {
  /// The alert title.
  public var title: String = ""

  /// The alert message.
  public var message: String = ""

  /// The alert primary button.
  public var primaryButtonTitle = "Accept"

  /// The alert secondary button.
  public var secondaryButtonTitle: String?

  /// Primary button event handler.
  public var primaryAction: (() -> ())?

  /// Secondary button event handler.
  public var secondaryAction: (() -> ())?

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
