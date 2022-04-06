//
//  WebRTCInfoView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCInfoView: View {
  // MARK: Properties

  @ObservedObject var viewModel: WebRTCViewModel
  
  let onToggle: () -> Void
  
  // MARK: Body

  var body: some View {
    GroupBox(
      label:
        WebRTCGroupBoxLabelView(
          labelText: "About",
          labelImage: "info.circle.fill",
          onToggle: onToggle)
    ) {
      ScrollView(.vertical, showsIndicators: false) {
        HStack {
          Image("LogoImage")
            .resizable()
            .frame(width: 128.0, height: 128.0)
          VStack(alignment: .leading) {
            HStack(alignment: .top) {
              Image(systemName: "info.circle.fill")
              Text("Version")
                .bold()
              Spacer()
              Text("0.1.0")
            }.padding()
            HStack(alignment: .top) {
              Image(systemName: "iphone.circle")
              Text("Compatibility")
                .bold()
              Spacer()
              Text("iOS 15.1")
            }.padding([.leading, .trailing, .bottom])
            HStack(alignment: .top) {
              Image(systemName: "link.circle")
              Text("Website")
                .bold()
              Spacer()
              if let destination = URL(string: "https://github.com/ognis1205/slam-at-home") {
                Link(
                  "slam-at-home",
                  destination: destination)
                  .foregroundColor(Color.fontColor)
                Image(systemName: "arrow.up.right.square").foregroundColor(Color.fontColor)
              } else {
                Text("slam-at-home")
              }
            }.padding([.leading, .trailing, .bottom])
            HStack(alignment: .top) {
              Image(systemName: "person.circle.fill")
              Text("Developer")
                .bold()
              Spacer()
              Text("Shingo OKAWA")
            }.padding([.leading, .trailing, .bottom])
          }
        }
        Spacer()
        Text("Copyright © 2022 Shingo OKAWA")
          .font(.footnote)
          .bold()
          .foregroundColor(Color.lightFontColor)
        Text("All Rights Reserved.")
          .font(.footnote)
          .bold()
          .foregroundColor(Color.lightFontColor)
      }
    }
    .groupBoxStyle(ModalGroupBoxStyle())
  }
}

struct WebRTCInfoView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCInfoView(
      viewModel: WebRTCViewModel(),
      onToggle: { print("toggled") })
  }
}
