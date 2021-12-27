//
//  Camera.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/28.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import SwiftUI
import Combine
import AVFoundation

final class Camera: ObservableObject {
  /// $Observable state of alert flag.
  @Published var showAlertError = false

  /// Reference to the current alert.
  var alert: Alert!

  /// The session so that the video preview layer can output what the camera is capturing.
  var avCaptureSession: AVCaptureSession
  
  /// Reference to the streaming service.
  private let streaming = StreamingService()

  ///
  private var subscriptions = Set<AnyCancellable>()

  /// Initializer.
  init() {
    self.avCaptureSession = self.streaming.avCaptureSession
    self.streaming.$shouldShowAlertView.sink { [weak self] (val) in
      self?.alert = self?.streaming.alert
      self?.showAlertError = val
    }
    .store(in: &self.subscriptions)
  }

  func configure() {
    self.streaming.checkPermissions()
    self.streaming.start()
  }
}
