//
//  WebRTCClient.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/25.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

public protocol WebRTCClientDelegate: AnyObject {
  func webRTC(_ client: WebRTCClient, didDiscoverLocalCandidate candidate: RTCIceCandidate)

  func webRTC(_ client: WebRTCClient, didChangeConnectionState state: RTCIceConnectionState)

  func webRTC(_ client: WebRTCClient, didReceiveData data: Data)
}

public class WebRTCClient: NSObject {
  private static let factory: RTCPeerConnectionFactory = {
    RTCInitializeSSL()
    let videoEncoderFactory = RTCDefaultVideoEncoderFactory()
    let videoDecoderFactory = RTCDefaultVideoDecoderFactory()
    return RTCPeerConnectionFactory(
      encoderFactory: videoEncoderFactory,
      decoderFactory: videoDecoderFactory)
  }()

  public var id: String

  public var streamId: String {
    return "stream-\(self.id)"
  }

  public var videoTrackId: String {
    return "video-\(self.id)"
  }

  internal weak var delegate: WebRTCClientDelegate?

  internal let connection: RTCPeerConnection

  internal let rtcAudioSession = RTCAudioSession.sharedInstance()

  internal let mediaConstrains = [
    kRTCMediaConstraintsOfferToReceiveAudio: kRTCMediaConstraintsValueTrue,
    kRTCMediaConstraintsOfferToReceiveVideo: kRTCMediaConstraintsValueTrue
  ]

  internal var videoSource: RTCVideoSource

  internal var videoCapturer: RTCVideoCapturer?

  internal var videoFrame: RTCVideoFrame?

  internal var videoTrack: RTCVideoTrack?

  internal var recieverVideoTrack: RTCVideoTrack?

  internal var dataChannel: RTCDataChannel?

  internal var recieverDataChannel: RTCDataChannel?

  @available(*, unavailable)
  override init() {
    fatalError("WebRTCClient:init is unavailable")
  }

  public required init(iceServers: [String]) {
    self.id = UUID().uuidString
    let config = RTCConfiguration()
    config.iceServers = [RTCIceServer(urlStrings: iceServers)]
    config.sdpSemantics = .unifiedPlan
    config.continualGatheringPolicy = .gatherContinually
    let constraints = RTCMediaConstraints(
      mandatoryConstraints: nil,
      optionalConstraints: ["DtlsSrtpKeyAgreement": kRTCMediaConstraintsValueTrue])
    self.videoSource = WebRTCClient.factory.videoSource()
    self.connection = WebRTCClient.factory.peerConnection(
      with: config,
      constraints: constraints,
      delegate: nil)
    super.init()
    self.createMediaSenders()
    self.connection.delegate = self
  }

  public func offer(didComplete: @escaping (_ sdp: RTCSessionDescription) -> Void) {
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

  public func answer(didComplete: @escaping (_ sdp: RTCSessionDescription) -> Void) {
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

  public func set(remoteSdp: RTCSessionDescription, didComplete: @escaping (Error?) -> Void) {
    self.connection.setRemoteDescription(remoteSdp, completionHandler: didComplete)
  }

  public func set(remoteIce: RTCIceCandidate) {
    self.connection.add(remoteIce)
  }

  public func send(_ data: Data) {
    let buffer = RTCDataBuffer(data: data, isBinary: true)
    self.recieverDataChannel?.sendData(buffer)
  }

  public func add(renderer: RTCVideoRenderer, videoDevice: AVCaptureDevice) {
    guard
      let capturer = self.videoCapturer as? RTCCameraVideoCapturer
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
    self.videoTrack?.add(renderer)
  }

  private func createMediaSenders() {
    if let videoTrack = self.createVideoTrack() {
      self.connection.add(videoTrack, streamIds: [self.streamId])
      self.recieverVideoTrack = self.connection.transceivers.first {
        $0.mediaType == .video
      }?.receiver.track as? RTCVideoTrack
      self.videoTrack = videoTrack
    }
    if let dataChannel = createDataChannel() {
      dataChannel.delegate = self
      self.dataChannel = dataChannel
    }
  }

  private func createVideoTrack() -> RTCVideoTrack? {
    #if TARGET_OS_SIMULATOR
      self.videoCapturer = RTCFileVideoCapturer(
        delegate: self.videoSource)
    #else
      self.videoCapturer = RTCCameraVideoCapturer(
        delegate: self)
    #endif
    return WebRTCClient.factory.videoTrack(
      with: self.videoSource,
      trackId: self.videoTrackId)
  }

  private func createDataChannel() -> RTCDataChannel? {
    let config = RTCDataChannelConfiguration()
    guard
      let channel = self.connection.dataChannel(forLabel: "WebRTCData", configuration: config)
    else {
      debugPrint("Warning: Couldn't create data channel.")
      return nil
    }
    return channel
  }
}
