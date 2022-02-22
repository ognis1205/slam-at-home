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

  @Environment(\.presentationMode) var presentationMode
  
  @Binding var isRecording: Bool

  @ObservedObject var viewModel: WebRTCViewModel = WebRTCViewModel()
  
  @State private var showSettings: Bool = false
  
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
        HStack {
          Spacer()
          Button(
            action: {
              self.showSettings.toggle()
            },
            label: {
              Image(systemName: "slider.horizontal.3")
                .foregroundColor(.white)
                .padding()
                .background(Color.themeColor)
                .clipShape(Circle())
            })
            .padding(.trailing, 10)
            .padding(.top, 10)
            .sheet(isPresented: self.$showSettings) {
              WebRTCSettingsView(viewModel: self.viewModel)
            }
        }
        Spacer()
        WebRTCControllerView(isRecording: $isRecording, viewModel: self.viewModel)
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
