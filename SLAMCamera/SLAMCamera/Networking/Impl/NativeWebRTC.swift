//
//  NativeWebRTC.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/01.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//
import Foundation
import WebRTC

public class NativeWebRTC: NSObject, WebRTC {
  /// The `RTCPeerConnectionFactory` is in charge of creating new RTCPeerConnection instances.
  private static let factory: RTCPeerConnectionFactory = {
    RTCInitializeSSL()
    let videoEncoderFactory = RTCDefaultVideoEncoderFactory()
    let videoDecoderFactory = RTCDefaultVideoDecoderFactory()
    return RTCPeerConnectionFactory(
      encoderFactory: videoEncoderFactory,
      decoderFactory: videoDecoderFactory)
  }()

  /// Identifier.
  public var id: String

  /// Stream identifier.
  internal var streamId: String
  
  /// Audio track identifier.
  internal var audioTrackId: String

  /// Video track identifier.
  internal var videoTrackId: String

  /// Reference to the WebRTC delegatee.
  internal weak var delegate: WebRTCDelegate?

  /// WebRTC peer connection.
  internal let connection: RTCPeerConnection

  /// WebRTC audio session.
  internal let rtcAudioSession =  RTCAudioSession.sharedInstance()

  /// WebRTC media constraints.
  internal let mediaConstrains = [
    kRTCMediaConstraintsOfferToReceiveAudio: kRTCMediaConstraintsValueTrue,
    kRTCMediaConstraintsOfferToReceiveVideo: kRTCMediaConstraintsValueTrue
  ]

  /// Video source of this peer.
  internal var videoSource: RTCVideoSource!

  /// Video capturer of this peer.
  internal var videoCapturer: RTCVideoCapturer?

  // customize
  //private var videoFrameCapturer: RTCVideoCapturer?
  internal var videoFrame: RTCVideoFrame?

  /// Video track of this peer.
  internal var videoTrack: RTCVideoTrack?

  /// Video track of reciever's peer.
  internal var recieverVideoTrack: RTCVideoTrack?

  /// Data channel of this peer.
  internal var dataChannel: RTCDataChannel?

  /// Data channel of reciever's peer.
  internal var recieverDataChannel: RTCDataChannel?

  @available(*, unavailable)
  override init() {
    fatalError("WebRTCClient:init is unavailable")
  }

  /// Initializer.
  public required init(iceServers: [String]) {
    self.id = UUID().uuidString
    self.streamId = "stream-\(self.id)"
    self.audioTrackId = "audio-\(self.id)"
    self.videoTrackId = "video-\(self.id)"
    let config = RTCConfiguration()
    config.iceServers = [RTCIceServer(urlStrings: iceServers)]
    config.sdpSemantics = .unifiedPlan
    config.continualGatheringPolicy = .gatherContinually
    let constraints = RTCMediaConstraints(
      mandatoryConstraints: nil,
      optionalConstraints: ["DtlsSrtpKeyAgreement":kRTCMediaConstraintsValueTrue])
    self.connection = NativeWebRTC.factory.peerConnection(
      with: config,
      constraints: constraints,
      delegate: nil)
    super.init()
    self.createMediaSenders()
    self.configureAudioSession()
    self.connection.delegate = self
  }

  /// WebRTC offer call.
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

  /// WebRTC answer call.
  public func answer(didComplete: @escaping (_ sdp: RTCSessionDescription) -> Void)  {
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

  /// Sets remote SDP on this client.
  public func set(remoteSdp: RTCSessionDescription, didComplete: @escaping (Error?) -> ()) {
    self.connection.setRemoteDescription(remoteSdp, completionHandler: didComplete)
  }

  /// Sets remote ICE on this client.
  public func set(remoteIce: RTCIceCandidate) {
    self.connection.add(remoteIce)
  }

  /// Sends a data to the partner.
  public func send(_ data: Data) {
    let buffer = RTCDataBuffer(data: data, isBinary: true)
    self.recieverDataChannel?.sendData(buffer)
  }

  /// Streams video on the track.
  public func add(renderer: RTCVideoRenderer, videoDevice: AVCaptureDevice) {
    guard let capturer = self.videoCapturer as? RTCCameraVideoCapturer else {
      return
    }
    guard
      let format = (RTCCameraVideoCapturer.supportedFormats(for: videoDevice).sorted {
        return CMVideoFormatDescriptionGetDimensions($0.formatDescription).width < CMVideoFormatDescriptionGetDimensions($1.formatDescription).width
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

  /// Creates media senders.
  private func createMediaSenders() {
    let audioTrack = self.createAudioTrack()
    self.connection.add(audioTrack, streamIds: [self.streamId])
    let videoTrack = self.createVideoTrack()
    self.videoTrack = videoTrack
    self.connection.add(videoTrack, streamIds: [self.streamId])
    self.recieverVideoTrack = self.connection.transceivers.first {
      $0.mediaType == .video
    }?.receiver.track as? RTCVideoTrack
    if let dataChannel = createDataChannel() {
      dataChannel.delegate = self
      self.dataChannel = dataChannel
    }
  }

  /// Configures audio session.
  private func configureAudioSession() {
    self.rtcAudioSession.lockForConfiguration()
    do {
      try self.rtcAudioSession.setCategory(AVAudioSession.Category.playAndRecord.rawValue)
      try self.rtcAudioSession.setMode(AVAudioSession.Mode.voiceChat.rawValue)
    } catch let error {
      debugPrint("Error changeing AVAudioSession category: \(error)")
    }
    self.rtcAudioSession.unlockForConfiguration()
  }

  /// Creates audio track.
  private func createAudioTrack() -> RTCAudioTrack {
    let constrains = RTCMediaConstraints(mandatoryConstraints: nil, optionalConstraints: nil)
    let source = NativeWebRTC.factory.audioSource(with: constrains)
    let audioTrack = NativeWebRTC.factory.audioTrack(with: source, trackId: self.audioTrackId)
    return audioTrack
  }

  /// Creates video track.
  private func createVideoTrack() -> RTCVideoTrack {
    self.videoSource = NativeWebRTC.factory.videoSource()
    #if TARGET_OS_SIMULATOR
      self.videoCapturer = RTCFileVideoCapturer(delegate: videoSource)
    #else
      self.videoCapturer = RTCCameraVideoCapturer(delegate: self)
    #endif
    let videoTrack = NativeWebRTC.factory.videoTrack(with: videoSource, trackId: self.videoTrackId)
    return videoTrack
  }

  /// Creates data channel.
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
