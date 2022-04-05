//
//  WebRTCView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/07.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct WebRTCView: View {
  // MARK: Properties
  
  @Binding var isRecording: Bool

  @ObservedObject var viewModel: WebRTCViewModel = WebRTCViewModel()
  
  // MARK: Body

  var body: some View {
    ZStack {
      #if arch(arm64)
        WebRTCMTLVideoView(model: viewModel.model)
          .onAppear {
            UIDevice.current.setValue(
              UIInterfaceOrientation.landscapeRight.rawValue,
              forKey: "orientation")
            AppDelegate.orientationLock = .landscapeRight
            viewModel.start()
          }
          .ignoresSafeArea(.all, edges: .all)
          .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
      #else
        // TODO: resolve OpenGL compatibility
        #error("This project must target ONLY arm64 so far")
//        WebRTCEAGLVideoView(model: viewModel.model)
//          .onAppear {
//            UIDevice.current.setValue(
//              UIInterfaceOrientation.landscapeRight.rawValue,
//              forKey: "orientation")
//            AppDelegate.orientationLock = .landscapeRight
//            viewModel.start()
//          }
//          .ignoresSafeArea(.all, edges: .all)
//          .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
      #endif
      VStack {
        WebRTCTopNavigationView(
          viewModel: self.viewModel)
        Spacer()
        WebRTCBottomNavigationView(
          viewModel: self.viewModel,
          isRecording: self.$isRecording)
      }
    }
  }
}

struct WebRTCView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCView(isRecording: .constant(true))
  }
}
