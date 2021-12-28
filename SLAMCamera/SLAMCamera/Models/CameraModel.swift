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

public class CameraModel: ObservableObject {
  /// $Observable state of alert flag.
  @Published var showAlert = false

  /// Reference to the current alert.
  private(set) var alert: AlertModel!

  /// The session so that the video preview layer can output what the camera is capturing.
  private(set) var avCaptureSession: AVCaptureSession
  
  /// Reference to the streaming service.
  private let streaming = StreamingService()

  /// Combine subscriptions.
  private var subscriptions = Set<AnyCancellable>()

  /// Initializer.
  public init() {
    self.avCaptureSession = self.streaming.avCaptureSession
    self.streaming.$shouldShowAlert.sink { [weak self] (val) in
      self?.alert = self?.streaming.alert
      self?.showAlert = val
    }
    .store(in: &self.subscriptions)
  }

  /// Configures and initiates the service.
  public func configure() {
    self.streaming.checkPermissions()
    self.streaming.start()
  }
}
