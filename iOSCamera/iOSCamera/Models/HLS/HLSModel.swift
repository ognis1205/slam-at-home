//
//  HLSModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/24.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import AVFoundation
import CocoaAsyncSocket
import Combine
import SwiftUI

class HLSModel: NSObject, ObservableObject, VideoCapturing {
  @Published var isConnected: Bool = false
  
  @Published var URL: String = "Not Available"

  @Published var showAlert: Bool = false
  
  var alertModel: AlertModel?

  var videoSetupResult: VideoSetupResult = .ready

  var isVideoCapturing: Bool = false

  let videoCapture: VideoCapture = VideoCapture(
    session: AVCaptureSession(),
    output: AVCaptureVideoDataOutput(),
    context: CIContext(options: nil))

  var streams: [Int: HLSStream] = [Int: HLSStream]()

  private var socket: GCDAsyncSocket?

  private var subscriptions: Set<AnyCancellable> = Set<AnyCancellable>()

  func start() {
    self.startVideoCapturing(self.videoCapture)
    debugPrint("Starting network service")
    if self.isVideoCapturing {
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
            self.URL = "http://\(ip):\(HLSConstants.PORT)"
            try self.socket?.accept(onInterface: ip, port: HLSConstants.PORT)
          } else {
            debugPrint("Could not get IP address")
            self.reportAlert(
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
        self.reportAlert(
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
