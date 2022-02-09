//
//  HLSModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import CocoaAsyncSocket

protocol HLSModelDelegate: AlertReportingDelegate {
  func didConnect()
  
  func didDisconnect()
  
  func ip(_ ip: String)
}

class HLSCapture: VideoConfigure {
  let session: AVCaptureSession

  let output: AVCaptureVideoDataOutput

  let context: CIContext
  
  init(
    session: AVCaptureSession,
    output: AVCaptureVideoDataOutput,
    context: CIContext,
    state: VideoConfigureState
  ) {
    self.session = session
    self.output = output
    self.context = context
    super.init(state: state)
  }
}

class HLSModel: NSObject, VideoConfiguring {
  weak var delegate: HLSModelDelegate?

  let capture: HLSCapture = HLSCapture(
    session: AVCaptureSession(),
    output: AVCaptureVideoDataOutput(),
    context: CIContext(options: nil),
    state: .ready)

  var streams: [Int: HLSStream] = [Int: HLSStream]()

  var socket: GCDAsyncSocket?
  
  func prepare() {
    guard
      let delegate = self.delegate
    else {
      debugPrint("HLSModel requires delegation")
      return
    }
    self.configure(self.capture, configure: self, alert: delegate)
  }

  func start() {
    guard
      let delegate = self.delegate
    else {
      debugPrint("HLSModel requires delegation")
      return
    }
    self.capture(alert: delegate)
    self.listen(delegate: delegate)
  }

  func capture(alert: AlertReportingDelegate) {
    debugPrint("Starting video session")
    switch self.capture.state {
    case .running:
      break
    case .configured:
      capture.session.startRunning()
      if capture.session.isRunning {
        capture.state(.running)
      }
    default:
      debugPrint("Application not authorized nor configured")
      self.alert(
        alert,
        title: "Camera Error",
        message: "Camera configuration failed. Either your device camera is not available or its missing permissions",
        primaryButtonTitle: "Accept",
        secondaryButtonTitle: nil,
        primaryAction: nil,
        secondaryAction: nil)
    }
  }

  func listen(delegate: HLSModelDelegate) {
    debugPrint("Starting network service")
    if self.capture.state == .running {
      self.socket = GCDAsyncSocket(
        delegate: self,
        delegateQueue: DispatchQueue(
          label: "server",
          attributes: []),
        socketQueue: DispatchQueue(
          label: "socket",
          attributes: .concurrent))
      do {
        if let ip = IP.getAddress() {
          if !ip.isEmpty {
            delegate.ip(ip)
            try self.socket?.accept(onInterface: ip, port: HLSConstants.PORT)
          } else {
            debugPrint("Could not get IP address")
            self.alert(
              delegate,
              title: "Network Error",
              message: "Device is not connected to WiFi network",
              primaryButtonTitle: "Accept",
              secondaryButtonTitle: nil,
              primaryAction: nil,
              secondaryAction: nil)
            return
          }
        }
      } catch {
        debugPrint("Could not start listening on port \(HLSConstants.PORT) (\(error))")
        self.alert(
          delegate,
          title: "Socket Error",
          message: "Port number is not available",
          primaryButtonTitle: "Accept",
          secondaryButtonTitle: nil,
          primaryAction: nil,
          secondaryAction: nil)
        return
      }
    }
  }
}
