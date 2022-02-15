//
//  WebRTCSettingsView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/28.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Combine
import SwiftUI

extension UIApplication {
  // MARK: Methods

  func endEditing() {
    sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
  }
}

struct WebRTCSettingsView: View {
  // MARK: Properties

  @Environment(\.presentationMode) var presentationMode

  @ObservedObject var viewModel: WebRTCViewModel
  
  // MARK: Methods
  
  func isValidURL(_ value: String?) -> Bool {
    let url = "(ws|wss)://((\\w)*|([0-9]*)|([-|_])*)+([\\.|/]((\\w)*|([0-9]*)|([-|_])*))+"
    return NSPredicate(format: "SELF MATCHES %@", url).evaluate(with: value)
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
                labelImage: "personalhotspot")
          ) {
            // swiftlint:disable line_length
            WebRTCSettingsHeaderView(
              labelImage: "network",
              labelColor: .green,
              content: "Establishing a WebRTC connection between two devices requires the use of a signaling server to resolve how to connect them over the internet.")
            WebRTCURLTextFieldView(
              viewModel: viewModel)
            WebRTCConnectToggleView(
              viewModel: viewModel)
            WebRTCSettingsRowView(
              name: "Remote SDP",
              content: viewModel.hasRemoteSdp ? "Yes" : "No")
            WebRTCSettingsRowView(
              name: "Local Candidates",
              content: String(viewModel.numberOfLocalCandidate))
            WebRTCSettingsRowView(
              name: "Remote Candidates",
              content: String(viewModel.numberOfRemoteCandidate))
          }
          GroupBox(
            label:
              WebRTCSettingsLabelView(
                labelText: "Application",
                labelImage: "apps.iphone")
          ) {
            // swiftlint:disable line_length
            WebRTCSettingsHeaderView(
              labelImage: "video.circle",
              labelColor: .blue,
              content: "This application is a part of SLAM@Home project. For more details such as usage restrictions, please refer to the link below.")
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
              })
              .accentColor(.primary)
          }
        }
      }
    }
  }
}

struct WebRTCSettingsView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsView(viewModel: WebRTCViewModel())
  }
}
