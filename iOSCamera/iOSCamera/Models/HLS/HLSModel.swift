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
  @Published public var alertModel: AlertModel?
  
  @Published public var isConnected: Bool = false
  
  @Published public var URL: String = "Not Available"

  public var showAlert: Bool {
    alertModel != nil
  }

  public var videoSetupResult: VideoSetupResult = .ready

  public var isVideoCapturing: Bool = false

  internal let videoCapturingContext: VideoCapturingContext = VideoCapturingContext(
    avCaptureSession: AVCaptureSession(),
    avCaptureVideoDataOutput: AVCaptureVideoDataOutput(),
    ciContext: CIContext(options: nil),
    dispatchQueue: DispatchQueue(
      label: "video capturing queue",
      attributes: []))

  internal var streams: [Int: HLSStream] = [Int: HLSStream]()
  
  internal let streamQueue: DispatchQueue = DispatchQueue(
    label: "stream queue",
    attributes: .concurrent)
  
  private let ip: String? = IP.getAddress()

  private var socket: GCDAsyncSocket?

  private let socketListenQueue: DispatchQueue = DispatchQueue(
    label: "socket listen queue",
    attributes: [])

  private let socketWriteQueue: DispatchQueue = DispatchQueue(
    label: "socket write queue",
    attributes: .concurrent)

  private var isSocketListening: Bool = false

  private var subscriptions: Set<AnyCancellable> = Set<AnyCancellable>()

  public func start() {
    self.startVideoCapturing(videoCapturingContext)
    debugPrint("Starting network service")
    if !self.isSocketListening && self.isVideoCapturing {
      self.socket = GCDAsyncSocket(
        delegate: self,
        delegateQueue: self.socketListenQueue,
        socketQueue: self.socketWriteQueue)
      do {
        if let ip = self.ip {
          if !ip.isEmpty { self.URL = "http://\(ip):\(HLSConstants.PORT)" }
        }
        try self.socket?.accept(onInterface: self.ip, port: HLSConstants.PORT)
      } catch {
        debugPrint("Could not start listening on port \(HLSConstants.PORT) (\(error))")
        self.reportAlert(
          title: "Socket Error",
          message: "Either port number is not available or device is not connected to WiFi network",
          primaryButtonTitle: "Accept",
          secondaryButtonTitle: nil,
          primaryAction: nil,
          secondaryAction: nil)
        return
      }
      DispatchQueue.main.async {
        self.isSocketListening = true
      }
    }
  }
}
