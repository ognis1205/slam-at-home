//
//  WebRTCSettingsPopupView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCSettingsPopupView: View {
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
            WebRTCPopupHeaderView(
              labelText: "Settings",
              labelImage: "gearshape.fill",
              isOpen: $isOpen)
        ) {
          HStack {
            Image("Logo")
              .resizable()
              .aspectRatio(contentMode: .fill)
              .frame(width: ViewConstants.LOGO_M, height: ViewConstants.LOGO_M)
              .clipped()
            // swiftlint:disable line_length
            Text("Establishing a WebRTC connection between two devices requires the use of a signaling server to resolve how to connect them over the internet.")
              .font(.footnote)
              .fontWeight(.semibold)
          }
          WebRTCURLTextFieldView(
            viewModel: viewModel)
          VStack(alignment: .leading) {
            HStack(alignment: .top) {
              Image(systemName: "person")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Local ID")
                .font(.subheadline)
                .bold()
              Spacer()
              Text(viewModel.model.client.id)
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "person.fill")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Remote ID")
                .font(.subheadline)
                .bold()
              Spacer()
              Text(viewModel.remoteId)
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "doc.plaintext")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Local SDP")
                .font(.subheadline)
                .bold()
              Spacer()
              Text(viewModel.hasLocalSdp ? "Yes" : "No")
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "doc.plaintext.fill")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Remote SDP")
                .font(.subheadline)
                .bold()
              Spacer()
              Text(viewModel.hasRemoteSdp ? "Yes" : "No")
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "point.3.connected.trianglepath.dotted")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Local Candidates")
                .font(.subheadline)
                .bold()
              Spacer()
              Text(String(viewModel.numberOfLocalCandidate))
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "point.3.filled.connected.trianglepath.dotted")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Remote Candidates")
                .font(.subheadline)
                .bold()
              Spacer()
              Text(String(viewModel.numberOfRemoteCandidate))
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
          }
          .background(.white)
          .clipShape(RoundedRectangle(cornerRadius: 5))
        }
        .groupBoxStyle(PopupStyle())
      }
      .cornerRadius(ViewConstants.RADIUS_M)
      .frame(
        width: UIScreen.main.bounds.width - ViewConstants.MARGIN_L,
        height: UIScreen.main.bounds.height - ViewConstants.MARGIN_S)
    }
  }
}

struct WebRTCSettingsPopupView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsPopupView(
      viewModel: WebRTCViewModel(),
      isOpen: .constant(false),
      onToggle: { print("toggled") })
  }
}
