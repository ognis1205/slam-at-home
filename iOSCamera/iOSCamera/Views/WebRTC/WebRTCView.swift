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
  
  // MARK: Components

  // swiftlint:disable identifier_name
  func Settings() -> some View {
    return HStack {
      Spacer()
      Button(
        action: {
          self.showSettings.toggle()
        },
        label: {
          Image(systemName: "gearshape")
            .font(.system(size: 20, weight: .medium, design: .default))
        }
      )
      .accentColor(.white)
      .sheet(isPresented: self.$showSettings) {
        WebRTCSettingsView(viewModel: self.viewModel)
      }
    }
  }
  
  // MARK: Body

  var body: some View {
    GeometryReader { reader in
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        VStack {
          Settings()
//          WebRTCVideoView(model: viewModel.model)
//            .onAppear {
//              viewModel.start()
//            }
//            .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
#if arch(arm64)
          WebRTCMTLVideoView(model: viewModel.model)
            .onAppear {
              UIDevice.current.setValue(
                UIInterfaceOrientation.portrait.rawValue,
                forKey: "orientation")
              AppDelegate.orientationLock = .portrait
              viewModel.start()
            }
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
            .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
#endif
        }
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
