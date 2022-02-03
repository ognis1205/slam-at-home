//
//  HLSView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct HLSView: View {
  @ObservedObject var viewModel: HLSViewModel = HLSViewModel()
  
  @State private var showSettings: Bool = false

  // swiftlint:disable identifier_name
  func Connection() -> some View {
    return Button(
      action: { /* Do nothing. */ },
      label: {
        Image(systemName: self.viewModel.label)
          .font(.system(size: 20, weight: .medium, design: .default))
      })
      .accentColor(self.viewModel.color)
  }

  func URL() -> some View {
    return Text(self.viewModel.URL)
  }

  var body: some View {
    GeometryReader { reader in
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        VStack {
          HStack {
            Connection()
            URL()
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
//              WebRTCSettingsView(nil)
            }
          }
//          RTCCameraPreviewView()
          HLSVideoView(avCaptureSession: viewModel.session)
            .onAppear { viewModel.start() }
            .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
        }
      }
    }
  }
}

struct HLSView_Previews: PreviewProvider {
  static var previews: some View {
    HLSView()
  }
}
