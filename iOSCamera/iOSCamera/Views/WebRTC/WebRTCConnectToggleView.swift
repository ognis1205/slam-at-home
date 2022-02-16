//
//  WebRTCConnectToggleView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/15.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCConnectToggleView: View, Debuggable {
  // MARK: Properties
  
  @ObservedObject var viewModel: WebRTCViewModel
  
  // MARK: Body

  var body: some View {
    VStack {
      Divider().padding(.vertical, 4)
      Toggle(isOn: $viewModel.isConnected) {
        Text("Connect").foregroundColor(.gray)
      }
        .toggleStyle(WiFiToggleStyle())
        .disabled(!viewModel.URL.isValid(.URL))
        .onChange(of: viewModel.isConnected) { connecting in
          if connecting {
            self.info("connect to URL ws://\(viewModel.URL)/connect...")
            guard
              let id = UIDevice.current.identifierForVendor,
              let url = URL(string: "ws://\(viewModel.URL)/connect?id=\(id.uuidString)")
            else {
              self.warn("failed to parse URL...")
              return
            }
            viewModel.model.connect(URL: url)
          } else {
            self.info("disconnect from URL ws://\(viewModel.URL)/connect...")
            viewModel.model.disconnect()
          }
        }
    }
  }
}

struct WebRTCConnectToggleView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCConnectToggleView(viewModel: WebRTCViewModel())
  }
}
