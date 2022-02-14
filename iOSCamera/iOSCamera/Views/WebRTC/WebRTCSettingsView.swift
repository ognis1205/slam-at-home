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
      ScrollView(.vertical, showsIndicators: false) {
        VStack(spacing: 20) {
          GroupBox(
            label:
              WebRTCSettingsLabelView(
              labelText: "Signaling Server",
              labelImage: "info.circle")
          ) {
            Divider().padding(.vertical, 4)
            HStack(alignment: .center, spacing: 10) {
              Image(systemName: "network")
                .resizable()
                .scaledToFit()
                .foregroundColor(.white)
                .padding()
                .background(.green)
                .frame(width: 80, height: 80)
                .cornerRadius(9)
              // swiftlint:disable line_length
              Text("Establishing a WebRTC connection between two devices requires the use of a signaling server to resolve how to connect them over the internet.")
                .font(.footnote)
            }
          }
          GroupBox(
            label:
              WebRTCSettingsLabelView(
              labelText: "Application",
              labelImage: "apps.iphone")
          ) {
            WebRTCSettingsRowView(
              name: "Developer",
              content: "Shingo OKAWA")
            WebRTCSettingsRowView(
              name: "Compatibility",
              content: "iOS 15.1")
            WebRTCSettingsRowView(
              name: "Website",
              linkLabel: "slam-at-home",
              linkDestination: "github.com/ognis1205/slam-at-home")
            WebRTCSettingsRowView(
              name: "SwiftUI",
              content: "2.0")
            WebRTCSettingsRowView(
              name: "Version",
              content: "1.0.0")
          }
        }
        .navigationTitle(Text("Settings"))
        .padding()
        .toolbar {
          ToolbarItem(placement: .primaryAction) {
            Button(
              action: {
                self.presentationMode.wrappedValue.dismiss()
              },
              label: {
                Image(systemName: "xmark")
//                  .font(.system(size: 20, weight: .medium, design: .default))
              })
              .accentColor(.white)
          }
        }
      }
    }
  }
//      Form {
//        Section(header: Text("Signaling Server")) {
//          Connect()
//          Text("text1")
//          Text("text2")
//          Text("text3")
//        }
//      }
}

struct WebRTCSettingsView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsView(viewModel: WebRTCViewModel())
  }
}
