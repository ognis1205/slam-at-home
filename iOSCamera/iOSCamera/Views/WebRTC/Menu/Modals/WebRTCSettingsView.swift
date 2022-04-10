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
  
  let onToggle: () -> Void
  
  // MARK: Body

  var body: some View {
    GroupBox(
      label:
        WebRTCGroupBoxLabelView(
          labelText: "Settings",
          labelImage: "gearshape.fill",
          onToggle: onToggle)
    ) {
      ScrollView(.vertical, showsIndicators: false) {
        HStack {
          Text("Signaling Server")
            .font(.headline)
            .bold()
            .foregroundColor(Color.lightFontColor)
          Spacer()
        }
        WebRTCURLTextFieldView(
          viewModel: viewModel)
        HStack {
          Text("Peer Connection")
            .font(.headline)
            .bold()
            .foregroundColor(Color.lightFontColor)
          Spacer()
        }
        VStack(alignment: .leading) {
          HStack(alignment: .top) {
            Image(systemName: "person.fill")
            Text("Local ID")
              .bold()
            Spacer()
            Text(viewModel.model.client.id)
          }.padding()
          HStack(alignment: .top) {
            Image(systemName: "person")
            Text("Remote ID")
              .bold()
            Spacer()
            Text(viewModel.remoteId)
          }.padding([.leading, .trailing, .bottom])
          HStack(alignment: .top) {
            Image(systemName: "doc.fill")
            Text("Local SDP")
              .bold()
            Spacer()
            Text(viewModel.hasLocalSdp ? "Yes" : "No")
          }.padding([.leading, .trailing, .bottom])
          HStack(alignment: .top) {
            Image(systemName: "doc")
            Text("Remote SDP")
              .bold()
            Spacer()
            Text(viewModel.hasRemoteSdp ? "Yes" : "No")
          }.padding([.leading, .trailing, .bottom])
          HStack(alignment: .top) {
            Image(systemName: "number")
            Text("Recieved Local Candidates")
              .bold()
            Spacer()
            Text(String(viewModel.numberOfLocalCandidate))
          }.padding([.leading, .trailing, .bottom])
          HStack(alignment: .top) {
            Image(systemName: "number")
            Text("Recieved Remote Candidates")
              .bold()
            Spacer()
            Text(String(viewModel.numberOfRemoteCandidate))
          }.padding([.leading, .trailing, .bottom])
        }
        .background(.white)
        .clipShape(RoundedRectangle(cornerSize: CGSize(width: 20, height: 20)))
      }
    }
    .groupBoxStyle(ModalGroupBoxStyle())
  }
}

struct WebRTCSettingsView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsView(
      viewModel: WebRTCViewModel(),
      onToggle: { })
  }
}
