//
//  HLSView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct HLSView: View {
  @ObservedObject var viewModel: HLSViewModel = HLSViewModel()
  
  @State private var showSettings: Bool = false

  var body: some View {
    GeometryReader { reader in
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        VStack {
          HStack {
            Button(
              action: {
                // Do nothing.
              },
              label: {
                Image(systemName: self.viewModel.connectionLabel)
                  .font(.system(size: 20, weight: .medium, design: .default))
              })
              .accentColor(self.viewModel.connectionColor)
            Text(self.viewModel.URL)
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
          CameraView(avCaptureSession: viewModel.session)
            .onAppear {
              viewModel.start()
            }
            .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.alert })
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
