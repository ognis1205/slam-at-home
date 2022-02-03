//
//  WebRTCEAGLVideoCameraView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//

import SwiftUI
import WebRTC

struct WebRTCEAGLVideoView: UIViewRepresentable {
  weak var client: WebRTCClient?

  func makeUIView(context: Context) -> RTCEAGLVideoView {
    let view = RTCEAGLVideoView(frame: CGRect.zero)
//    self.client?.capture(renderer: view)
    return view
  }
  
  func updateUIView(_ uiView: RTCEAGLVideoView, context: Context) {
    // Placeholder.
  }
}

struct WebRTCEAGLVideoView_Preview: PreviewProvider {
    static var previews: some View {
      WebRTCEAGLVideoView(client: WebRTCClient(iceServers: WebRTCConstants.ICE_SERVERS))
    }
}

//struct WebRTCCameraView : UIViewRepresentable {
//  class Wrapper: UIView {
//    override public class var layerClass: AnyClass {
//      RTCCameraPreviewView.self
//    }
        
//    var avCaptureVideoPreviewLayer: AVCaptureVideoPreviewLayer {
//      return layer as! AVCaptureVideoPreviewLayer
//    }
//  }
//  @Binding var video: VideoCall
 
//  @Binding var remoteView: RTCEAGLVideoView

//  func updateUIView(_ uiView: RTCEAGLVideoView, context: UIViewRepresentableContext<RemoteView>) {
//  }

//    func makeUIView(context: Context) -> RTCEAGLVideoView  {
//        self.remoteView.frame = CGRect(x: 20, y: 20, width: 200, height: 300)
//        self.remoteView = self.video.remoteVideoView!
//        return self.remoteView
//      }
//}

//struct WebRTCCameraView_Previews: PreviewProvider {
//  static var previews: some View {
//    WebRTCCameraView(avCaptureSession: AVCaptureSession())
//  }
//}
