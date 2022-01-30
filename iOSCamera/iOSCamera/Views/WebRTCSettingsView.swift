//
//  WebRTCSettingsView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/28.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Combine
import SwiftUI

class URLValidator: ObservableObject {
  @Published var value = ""

  func validate(_ value: String) -> String {
    value.replacingOccurrences(
      of: "\\W", with: "", options: .regularExpression)
  }
}

struct WebRTCSettingsView: View {
//  let model: WebRTCModel
  
  @State var isConnected: Bool = false
  
  @ObservedObject var urlValidator = URLValidator()

  var body: some View {
    NavigationView {
      Form {
        Section(header: Text("Signaling Server")) {
          HStack {
            TextField("ws://0.0.0.0:10000", text: $urlValidator.value)
              .multilineTextAlignment(.leading)
              .onReceive(Just(urlValidator.value)) { newValue in
                let value = newValue.replacingOccurrences(
                  of: "\\W", with: "", options: .regularExpression)
                if value != newValue {
                  self.urlValidator.value = value
                }
                print(newValue)
              }
            Spacer()
            Toggle("", isOn: $isConnected)
              .toggleStyle(WiFiToggleStyle())
              .onChange(of: isConnected) { value in
                print(value)
              }
          }
        }
        Text("Settings screen")
      }
      .navigationTitle("Settings")
    }
  }
}

struct WebRTCSettingsView_Previews: PreviewProvider {
  static var previews: some View {
    WebRTCSettingsView()
  }
}
