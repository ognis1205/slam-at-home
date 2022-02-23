//
//  WebRTCModel+WebRTCClientDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension WebRTCModel: WebRTCClientDelegate {
  // MARK: Methods

  func webRTC(_ client: WebRTCClient, didDiscoverLocalCandidate candidate: RTCIceCandidate) {
    self.info("webRTC did discover local candidate...")
    guard
      let remoteId = self.client.remoteId
    else {
      self.warn("webRTC did discover local candidate failed, remoteId is not ready...")
      return
    }
    self.signal?.send(
      candidate: candidate,
      signalFrom: self.client.id,
      signalTo: remoteId)
    self.delegate?.webRTC(didDiscoverLocalCandidate: candidate)
  }
    
  func webRTC(_ client: WebRTCClient, didChangeConnectionState state: RTCIceConnectionState) {
    self.info("webRTC did change connection state...")
    self.delegate?.webRTC(didChangeConnectionState: state)
  }
    
  func webRTC(_ client: WebRTCClient, didReceiveData data: Data) {
    self.info(
      "webRTC did recieve data: \(String(data: data, encoding: .utf8) ?? "(Binary: \(data.count) bytes)")...")
    self.delegate?.webRTC(didReceiveData: data)
  }
  
  func webRTC(_ client: WebRTCClient, didChangeSignalingState state: RTCSignalingState) {
    self.info("webRTC did change signaling state...")
    self.delegate?.webRTC(didChangeSignalingState: state)
  }
  
  func webRTC(_ client: WebRTCClient, didCapture frame: RTCVideoFrame) -> RTCVideoFrame? {
    guard
      let i420 = RGB.fromRTCI420Buffer(frame.buffer.toI420() as? RTCI420Buffer),
      let depth = self.predict(
        i420,
        width: WebRTCConstants.CAMERA_RESOLUTION.width,
        height: WebRTCConstants.CAMERA_RESOLUTION.height),
      let buffer = depth.pixelBuffer
    else {
      return nil
    }
//    let filter = CIFilter(name: "CISharpenLuminance")!
//    filter.setValue(depth.ciImage, forKey: kCIInputImageKey)
//    filter.setValue(0.8, forKey: kCIInputSharpnessKey)
//    let context = CIContext(options: nil)
//    let cgimg = context.createCGImage(
//      filter.outputImage!,
//      from: filter.outputImage!.extent)
//    let finalImage = UIImage(ciImage: filter.outputImage!)

    return RTCVideoFrame(
//      buffer: RTCCVPixelBuffer(pixelBuffer: finalImage.pixelBuffer!),
      buffer: RTCCVPixelBuffer(pixelBuffer: buffer),
      rotation: RTCVideoRotation._0,
      timeStampNs: Int64(Date().timeIntervalSince1970 * 1_000_000_000))
  }
}
