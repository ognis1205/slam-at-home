//
//  HLSView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct HLSView: View {
  @StateObject var model: HLSModel = HLSModel()
  
  @State private var showSettings: Bool = false

  var body: some View {
    GeometryReader { reader in
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        VStack {
          HStack {
            Button(
              action: {
              },
              label: {
                Image(systemName: model.isConnected ? "wifi.circle.fill" : "wifi.circle")
                  .font(.system(size: 20, weight: .medium, design: .default))
              }
            )
            .accentColor(model.isConnected ? .red : .white)
            Text(model.URL)
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
              WebRTCSettingsView()
            }
          }
          CameraView(avCaptureSession: model.videoCapture.session)
            .onAppear {
              model.start()
            }
            .alert(
              isPresented: $model.showAlert,
              content: {
                Alert(
                  title: Text(model.alertModel?.title ?? ""),
                  message: Text(model.alertModel?.message ?? ""),
                  dismissButton: .default(
                    Text(model.alertModel?.primaryButtonTitle ?? ""),
                    action: { model.alertModel?.primaryAction?() }
                  )
                )
              }
            )
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
