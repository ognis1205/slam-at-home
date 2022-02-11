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

  func isValid() -> Bool {
    let url = "((?:ws|wss|http|https)://)?(?:www\\.)?[\\w\\d\\-_]+\\.\\w{2,3}(\\.\\w{2})?(/(?<=/)(?:[\\w\\d\\-./_]+)?)?"
    return NSPredicate(format: "SELF MATCHES %@", url).evaluate(with: self.value)
  }
}

extension UIApplication {
    func endEditing() {
        sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}

struct WebRTCSettingsView: View {
  // MARK: Properties

  @Environment(\.presentationMode) var presentationMode

  @ObservedObject var viewModel: WebRTCViewModel
  
  @ObservedObject var urlValidator = URLValidator()
  
  // MARK: Methods
  
  func isValidURL(_ value: String?) -> Bool {
    let url = "(ws|wss)://((\\w)*|([0-9]*)|([-|_])*)+([\\.|/]((\\w)*|([0-9]*)|([-|_])*))+"
    return NSPredicate(format: "SELF MATCHES %@", url).evaluate(with: value)
  }
  
  // MARK: Components
  
  // swiftlint:disable identifier_name
  func Connect() -> some View {
    return HStack {
      TextField("ws://0.0.0.0:10000", text: $viewModel.URL)
//        .textInputAutocapitalization(.never)
//        .disableAutocorrection(true)
//        .disabled(viewModel.isConnected)
//        .multilineTextAlignment(.leading)
        .onTapGesture {
          UIApplication.shared.endEditing()
        }
//      Toggle("", isOn: $viewModel.isConnected)
//        .toggleStyle(WiFiToggleStyle())
//        .disabled(!urlValidator.isValid())
//        .onChange(of: viewModel.isConnected) { value in
//          print(value)
//          print(urlValidator.value)
//        }
    }
  }
  
  // MARK: Body

  var body: some View {
    NavigationView {
      Form {
        Section(header: Text("Signaling Server")) {
          Connect()
          Text("text1")
          Text("text2")
          Text("text3")
        }
      }
    }
    .navigationTitle("WebRTC Settings")
    .navigationViewStyle(StackNavigationViewStyle())
  }
}

struct WebRTCSettingsView_Previews: PreviewProvider {
  static var previews: some View {
    WebRTCSettingsView(viewModel: WebRTCViewModel())
  }
}
