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

class HLSModel: NSObject, VideoCapturing {
  weak var delegate: HLSModelDelegate?

  var alert: AlertModel?

  let videoCapture: VideoCapture = VideoCapture(
    session: AVCaptureSession(),
    output: AVCaptureVideoDataOutput(),
    context: CIContext(options: nil),
    state: .ready)

  var streams: [Int: HLSStream] = [Int: HLSStream]()

  var socket: GCDAsyncSocket?

  func start() {
    guard
      let delegate = self.delegate
    else {
      debugPrint("HLSModel requires delegation")
      return
    }
    self.capture(self.videoCapture, delegate: delegate)
    debugPrint("Starting network service")
    if self.videoCapture.state == .running {
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
