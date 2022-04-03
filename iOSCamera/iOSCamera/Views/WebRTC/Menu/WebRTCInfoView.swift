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
              labelText: "About",
              labelImage: "info.circle.fill",
              isOpen: $isOpen)
        ) {
          HStack {
            Image("Logo")
              .resizable()
              .aspectRatio(contentMode: .fill)
              .frame(width: ViewConstants.LOGO_M, height: ViewConstants.LOGO_M)
              .clipped()
            // swiftlint:disable line_length
            Text("This application is a part of SLAM@HOME project. For more details such as usage restrictions, please refer to the link below.")
              .font(.footnote)
              .fontWeight(.semibold)
          }
          VStack(alignment: .leading) {
            HStack(alignment: .top) {
              Image(systemName: "info.circle.fill")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Version")
                .font(.subheadline)
                .bold()
              Spacer()
              Text("1.0.0")
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "applelogo")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Compatibility")
                .font(.subheadline)
                .bold()
              Spacer()
              Text("iOS 15.1")
                .font(.subheadline)
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "globe")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Website")
                .font(.subheadline)
                .bold()
              Spacer()
              if let destination = URL(string: "https://github.com/ognis1205/slam-at-home") {
                Link(
                  "slam-at-home",
                  destination: destination)
                  .foregroundColor(Color.fontColor)
                  .font(.subheadline)
                Image(systemName: "arrow.up.right.square").foregroundColor(Color.fontColor)
              } else {
                Text("slam-at-home")
                  .font(.subheadline)
              }
            }.padding(ViewConstants.PADDING_S)
            HStack(alignment: .top) {
              Image(systemName: "person.fill")
                .font(.system(size: ViewConstants.FONT_M, weight: .semibold))
                .frame(width: ViewConstants.FONT_M)
              Text("Developer")
                .font(.subheadline)
                .bold()
              Spacer()
              Text("Shingo OKAWA")
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

struct WebRTCInfoView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCInfoView(
      viewModel: WebRTCViewModel(),
      isOpen: .constant(false),
      onToggle: { print("toggled") })
  }
}
