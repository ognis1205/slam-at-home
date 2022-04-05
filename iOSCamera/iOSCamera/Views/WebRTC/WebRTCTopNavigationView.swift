//
//  WebRTCTopNavigationView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCTopNavigationView: View {
  // MARK: Properties
  
  @ObservedObject var viewModel: WebRTCViewModel
  
  @State var showInfo: Bool = false
  
  @State var showSettings: Bool = false
  
  // MARK: Body

  var body: some View {
    HStack {
      Button(
        action: { self.showInfo.toggle() },
        label: { Image(systemName: "info") })
        .buttonStyle(IconButtonStyle())
        .padding([.leading, .top])
        .fullScreenCover(isPresented: self.$showInfo) {
          WebRTCInfoView(
            viewModel: self.viewModel,
            onToggle: { self.showInfo.toggle() })
        }
      Spacer()
      Button(
        action: { self.showSettings.toggle() },
        label: { Image(systemName: "gearshape.fill") })
        .buttonStyle(IconButtonStyle())
        .padding([.trailing, .top])
        .fullScreenCover(isPresented: self.$showSettings) {
          WebRTCSettingsView(
            viewModel: self.viewModel,
            onToggle: { self.showSettings.toggle() })
        }
    }
  }
}

struct WebRTCTopNavigationView_Previews: PreviewProvider {
    static var previews: some View {
        WebRTCTopNavigationView(
          viewModel: WebRTCViewModel())
    }
}
