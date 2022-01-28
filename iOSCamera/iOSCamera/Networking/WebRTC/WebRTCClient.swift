//
//  WebRTCClient.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

struct VideoTrack {
  var source: RTCVideoSource

  var capturer: RTCVideoCapturer?

  var frame: RTCVideoFrame?

  var sender: RTCVideoTrack?

  var reciever: RTCVideoTrack?
  
  fileprivate mutating func configure(_ client: WebRTCClient) {
    debugPrint("Configuring WebRTC video track.")
    #if TARGET_OS_SIMULATOR
      self.capturer = RTCFileVideoCapturer(
        delegate: self.source)
    #else
      self.capturer = RTCCameraVideoCapturer(
        delegate: client)
    #endif
    self.sender = WebRTCClient.factory.videoTrack(
      with: self.source,
      trackId: client.videoTrackId)
    self.reciever = client.connection.transceivers.first {
      $0.mediaType == .video
    }?.receiver.track as? RTCVideoTrack
    debugPrint("Configured WebRTC video track.")
  }
}

struct DataChannel {
  var sender: RTCDataChannel?

  var reciever: RTCDataChannel?
  
  fileprivate mutating func configure(_ client: WebRTCClient) {
    debugPrint("Configuring WebRTC data channel.")
    let config = RTCDataChannelConfiguration()
    if let channel = client.connection.dataChannel(
      forLabel: "WebRTCData",
      configuration: config) {
      channel.delegate = client
      self.sender = channel
    } else {
      debugPrint("Warning: Couldn't create data channel.")
    }
    debugPrint("Configured WebRTC data channel.")
  }
}

protocol WebRTCClientDelegate: AnyObject {
  func webRTC(_ client: WebRTCClient, didDiscoverLocalCandidate candidate: RTCIceCandidate)

  func webRTC(_ client: WebRTCClient, didChangeConnectionState state: RTCIceConnectionState)

  func webRTC(_ client: WebRTCClient, didReceiveData data: Data)
}

class WebRTCClient: NSObject {
  fileprivate static let factory: RTCPeerConnectionFactory = {
    RTCInitializeSSL()
    let videoEncoderFactory = RTCDefaultVideoEncoderFactory()
    let videoDecoderFactory = RTCDefaultVideoDecoderFactory()
    return RTCPeerConnectionFactory(
      encoderFactory: videoEncoderFactory,
      decoderFactory: videoDecoderFactory)
  }()

  var id: String
  
  let connection: RTCPeerConnection
  
  weak var delegate: WebRTCClientDelegate?

  var streamId: String {
    return "stream-\(self.id)"
  }

  var videoTrackId: String {
    return "video-\(self.id)"
  }

  let mediaConstrains = [
    kRTCMediaConstraintsOfferToReceiveAudio: kRTCMediaConstraintsValueFalse,
    kRTCMediaConstraintsOfferToReceiveVideo: kRTCMediaConstraintsValueTrue
  ]
  
  var videoTrack = VideoTrack(
    source: WebRTCClient.factory.videoSource())

  var dataChannel = DataChannel()

  @available(*, unavailable)
  override init() {
    fatalError("WebRTCClient:init is unavailable")
  }

  required init(iceServers: [String]) {
    self.id = UUID().uuidString
    let config = RTCConfiguration()
    config.iceServers = [RTCIceServer(urlStrings: iceServers)]
    config.sdpSemantics = .unifiedPlan
    config.continualGatheringPolicy = .gatherContinually
    let constraints = RTCMediaConstraints(
      mandatoryConstraints: nil,
      optionalConstraints: ["DtlsSrtpKeyAgreement": kRTCMediaConstraintsValueTrue])
    self.connection = WebRTCClient.factory.peerConnection(
      with: config,
      constraints: constraints,
      delegate: nil)
    super.init()
    self.videoTrack.configure(self)
    self.dataChannel.configure(self)
    self.connection.delegate = self
  }

  func offer(didComplete: @escaping (_ sdp: RTCSessionDescription) -> Void) {
    let constrains = RTCMediaConstraints(
      mandatoryConstraints: self.mediaConstrains,
      optionalConstraints: nil)
    self.connection.offer(for: constrains) { (sdp, error) in
      guard let sdp = sdp else {
        return
      }
      self.connection.setLocalDescription(sdp, completionHandler: { (error) in
        didComplete(sdp)
      })
    }
  }

  func answer(didComplete: @escaping (_ sdp: RTCSessionDescription) -> Void) {
    let constrains = RTCMediaConstraints(
      mandatoryConstraints: self.mediaConstrains,
      optionalConstraints: nil)
    self.connection.answer(for: constrains) { (sdp, error) in
      guard let sdp = sdp else {
        return
      }
      self.connection.setLocalDescription(sdp, completionHandler: { (error) in
        didComplete(sdp)
      })
    }
  }

  func set(remoteSdp: RTCSessionDescription, didComplete: @escaping (Error?) -> Void) {
    self.connection.setRemoteDescription(remoteSdp, completionHandler: didComplete)
  }

  func set(remoteIce: RTCIceCandidate) {
    self.connection.add(remoteIce)
  }

  func send(_ data: Data) {
    let buffer = RTCDataBuffer(data: data, isBinary: true)
    self.dataChannel.reciever?.sendData(buffer)
  }

  func capture(renderer: RTCVideoRenderer, videoDevice: AVCaptureDevice) {
    guard
      let capturer = self.videoTrack.capturer as? RTCCameraVideoCapturer
    else {
      return
    }
    guard
      let format = (RTCCameraVideoCapturer.supportedFormats(for: videoDevice).sorted {
        let lhs = CMVideoFormatDescriptionGetDimensions($0.formatDescription).width
        let rhs = CMVideoFormatDescriptionGetDimensions($1.formatDescription).width
        return lhs < rhs
      }).last,
      let fps = (format.videoSupportedFrameRateRanges.sorted {
        return $0.maxFrameRate < $1.maxFrameRate
      }.last)
    else {
      return
    }
    capturer.startCapture(
      with: videoDevice,
      format: format,
      fps: Int(fps.maxFrameRate))
    self.videoTrack.sender?.add(renderer)
  }
}
