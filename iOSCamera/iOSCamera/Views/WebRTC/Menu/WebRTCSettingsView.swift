//
//  WebRTCSettingsView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCSettingsView: View {
  // MARK: Properties

  @ObservedObject var viewModel: WebRTCViewModel
  
  @Binding var isOpen: Bool
  
  let onToggle: () -> Void
  
  // MARK: Body

  var body: some View {
    ZStack {
      GeometryReader { _ in
        EmptyView()
      }
      .background(Color.gray.opacity(0.8))
      .onTapGesture {
        self.onToggle()
      }
      ScrollView(.vertical, showsIndicators: false) {
        GroupBox(
          label:
            WebRTCMenuTitleView(
              labelText: "Signaling Server",
              labelImage: "personalhotspot")
        ) {
          // swiftlint:disable line_length
          WebRTCMenuHeaderView(
            labelImage: "network",
            labelColor: .green,
            content: "Establishing a WebRTC connection between two devices requires the use of a signaling server to resolve how to connect them over the internet.")
          WebRTCURLTextFieldView(
            viewModel: viewModel)
          WebRTCConnectToggleView(
            viewModel: viewModel)
          WebRTCMenuItemView(
            name: "Local ID",
            content: viewModel.model.client.id)
          WebRTCMenuItemView(
            name: "Remote ID",
            content: viewModel.remoteId)
          WebRTCMenuItemView(
            name: "Local SDP",
            content: viewModel.hasLocalSdp ? "Yes" : "No")
          WebRTCMenuItemView(
            name: "Remote SDP",
            content: viewModel.hasRemoteSdp ? "Yes" : "No")
          WebRTCMenuItemView(
            name: "Local Candidates",
            content: String(viewModel.numberOfLocalCandidate))
          WebRTCMenuItemView(
            name: "Remote Candidates",
            content: String(viewModel.numberOfRemoteCandidate))
        }
        .padding()
      }
      .frame(
        width: UIScreen.main.bounds.width - 250,
        height: UIScreen.main.bounds.height - 40)
    }
  }
}

struct WebRTCSettingsView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsView(
      viewModel: WebRTCViewModel(),
      isOpen: .constant(false),
      onToggle: { print("toggled") })
  }
}
