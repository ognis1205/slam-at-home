//
//  WebRTCConnectToggleView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/15.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCConnectToggleView: View {
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
//                .disabled(urlValidator.isValid())
        .onChange(of: viewModel.isConnected) { value in
          print(value)
//          print(urlValidator.value)
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
