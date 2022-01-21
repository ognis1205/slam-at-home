//
//  SettingsModel.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/18.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import Combine
import AVFoundation

public class SettingsModel: ObservableObject {
  /// $Observable state of visible flag.
  @Published
  var showSettings = false

  /// $Observable state of alert flag.
  @Published var showAlert: Bool = false

  /// $Observable state of URL.
  @Published var signalingServerURL: String = "unknown"

  /// Reference to the current alert.
  private(set) var alert: AlertModel!

  /// Reference to the streaming service.
  private var streaming: StreamingService

  /// Combine subscriptions.
  private var subscriptions: Set<AnyCancellable> = Set<AnyCancellable>()

  /// Initializer.
  public init() {
    self.streaming.shouldShowAlertPublisher.sink { [weak self] (val) in
      self?.alert = self?.streaming.alert
      self?.showAlert = val
    }
    .store(in: &self.subscriptions)
  }

  /// Configures and initiates the service.
  public func start() -> Void {
    self.streaming.checkPermissions()
    self.streaming.start()
  }
}

