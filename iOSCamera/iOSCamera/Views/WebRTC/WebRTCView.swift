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

  @ObservedObject var viewModel: WebRTCViewModel = WebRTCViewModel()
  
  @State private var showSettings: Bool = false
  
  // MARK: Body

  var body: some View {
    ZStack {
      #if arch(arm64)
        WebRTCMTLVideoView(model: viewModel.model)
          .onAppear {
            UIDevice.current.setValue(
              UIInterfaceOrientation.portrait.rawValue,
              forKey: "orientation")
            AppDelegate.orientationLock = .portrait
            viewModel.start()
          }
          .ignoresSafeArea(.all, edges: .all)
          .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
      #else
        WebRTCEAGLVideoView(model: viewModel.model)
          .onAppear {
            UIDevice.current.setValue(
              UIInterfaceOrientation.portrait.rawValue,
              forKey: "orientation")
            AppDelegate.orientationLock = .portrait
            viewModel.start()
          }
          .ignoresSafeArea(.all, edges: .all)
          .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
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
                .foregroundColor(.black)
                .padding()
                .background(.white)
                .clipShape(Circle())
            })
            .padding(.trailing, 10)
            .sheet(isPresented: self.$showSettings) {
              WebRTCSettingsView(viewModel: self.viewModel)
            }
        }
        Spacer()
      }
    }
  }
}

struct WebRTCView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCView()
  }
}
