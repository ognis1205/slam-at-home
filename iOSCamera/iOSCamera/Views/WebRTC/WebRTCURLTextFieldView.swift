//
//  WebRTCURLTextFieldView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/15.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCURLTextFieldView: View {
  // MARK: Properties
  
  @ObservedObject var viewModel: WebRTCViewModel
  
  // MARK: Body

  var body: some View {
    Divider().padding(.vertical, 4)
    HStack {
      Image(systemName: "wifi").foregroundColor(.secondary)
      TextField("ws://0.0.0.0:10000", text: $viewModel.URL)
        .disableAutocorrection(true)
    }
      .padding()
      .disabled(viewModel.isConnected)
      .background(Capsule().fill(.gray))
    }
}

struct WebRTCURLTextFieldView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCURLTextFieldView(viewModel: WebRTCViewModel())
  }
}
