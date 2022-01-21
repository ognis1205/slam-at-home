//
//  WebRTCService.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/18.
//
import Foundation
import AVFoundation
import CocoaAsyncSocket

public protocol StreamingService: AnyObject {
  /// The service port number.
  static var PORT: UInt16 { get }

  /// $Observable state of URL.
  var URLPublisher: Published<String>.Publisher { get }

  /// $Observable state of alert flag.
  var shouldShowAlertPublisher: Published<Bool>.Publisher { get }

  /// $Observable state of socket listening state.
  var isConnectedPublisher: Published<Bool>.Publisher { get }

  /// $Observable state of camera availability.
  var isCameraUnavailablePublisher: Published<Bool>.Publisher { get }

  /// $Observable state of socket availability.
  var isSocketUnavailablePublisher: Published<Bool>.Publisher { get }
  
  /// The session so that the video preview layer can output what the camera is capturing.
  var avCaptureSession: AVCaptureSession { get }
  
  /// Reference to the current alert.
  var alert: AlertModel { get }

  /// Checks for user's permissions
  func checkPermissions() -> Void

  /// Configures the device and session.
  func start() -> Void
}
