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
            WebRTCMenuTitleView(
              labelText: "Application",
              labelImage: "apps.iphone")
        ) {
          // swiftlint:disable line_length
          WebRTCMenuHeaderView(
            labelImage: "video.circle",
            labelColor: .themeColor,
            content: "This application is a part of SLAM@Home project. For more details such as usage restrictions, please refer to the link below.")
          WebRTCMenuItemView(
            name: "Version",
            content: "1.0.0")
          WebRTCMenuItemView(
            name: "Compatibility",
            content: "iOS 15.1")
          WebRTCMenuItemView(
            name: "Website",
            linkLabel: "slam-at-home",
            linkDestination: "github.com/ognis1205/slam-at-home")
          WebRTCMenuItemView(
            name: "Developer",
            content: "Shingo OKAWA")
        }
        .cornerRadius(5)
      }
      .cornerRadius(5)
      .frame(
        width: UIScreen.main.bounds.width - 250,
        height: UIScreen.main.bounds.height - 40)
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
