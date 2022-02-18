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
          let endpoint = String(
            format: WebRTCConstants.SIGNALING_ENDPOINT,
            viewModel.URL,
            viewModel.model.client.id)
          if connecting {
            self.info("connect to URL \(endpoint)...")
            guard
              let url = URL(string: endpoint)
            else {
              self.warn("failed to parse URL...")
              return
            }
            viewModel.model.connect(URL: url)
          } else {
            self.info("disconnect from URL \(endpoint)...")
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
