//
//  WebRTCURLTextFieldView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/15.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct CustomTextField: View {
  // MARK: Properties

  var placeholder: Text
  
  @Binding var text: String
  
  var disabled: Bool

  // MARK: Body

  var body: some View {
    ZStack(alignment: .leading) {
      if text.isEmpty { placeholder }
      TextField("", text: $text)
        .disableAutocorrection(true)
        .disabled(disabled)
    }
  }
}

struct WebRTCURLTextFieldView: View, Debuggable {
  // MARK: Properties
  
  @ObservedObject var viewModel: WebRTCViewModel
  
  // MARK: Body

  var body: some View {
    HStack {
      Image(systemName: "wifi")
        .foregroundColor(viewModel.isSignaling ? Color.uiGreenColor : Color.fontColor)
      CustomTextField(
        placeholder: Text("0.0.0.0:10000").foregroundColor(.gray),
        text: $viewModel.URL,
        disabled: viewModel.isSignaling)
      Toggle(isOn: $viewModel.isSignaling) {
        Text("")
      }
        .toggleStyle(WiFiToggleStyle())
        .disabled(!viewModel.URL.isValid(.URL))
        .onChange(of: viewModel.isSignaling) { connecting in
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
            viewModel.reset()
          }
        }
    }
      .padding()
      .background(Capsule().fill(.white))
    }
}

struct WebRTCURLTextFieldView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCURLTextFieldView(viewModel: WebRTCViewModel())
  }
}
