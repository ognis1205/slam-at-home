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

public class HLSModel: NSObject, ObservableObject, VideoCapturing {
  @Published public var isConnected: Bool = false
  
  @Published public var URL: String = "Not Available"

  @Published public var showAlert: Bool = false
  
  public var alertModel: AlertModel?

  public var videoSetupResult: VideoSetupResult = .ready

  public var isVideoCapturing: Bool = false

  public let videoCapturingContext: VideoCapturingContext = VideoCapturingContext(
    avCaptureSession: AVCaptureSession(),
    avCaptureVideoDataOutput: AVCaptureVideoDataOutput(),
    ciContext: CIContext(options: nil))

  internal var streams: [Int: HLSStream] = [Int: HLSStream]()

  private var socket: GCDAsyncSocket?

  private var subscriptions: Set<AnyCancellable> = Set<AnyCancellable>()

  public func start() {
    self.startVideoCapturing(videoCapturingContext)
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
