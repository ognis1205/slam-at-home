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
  
  @Binding var showInfo: Bool

  @Binding var showSettings: Bool
  
  // MARK: Body

  var body: some View {
    HStack {
      Button(
        action: {
          self.showInfo.toggle()
        },
        label: {
          Image(systemName: "info")
        })
        .buttonStyle(IconButtonStyle())
        .padding(.leading, ViewConstants.PADDING_M)
        .padding(.top, ViewConstants.PADDING_M)
      Spacer()
      Button(
        action: {
          self.showSettings.toggle()
        },
        label: {
          Image(systemName: "gearshape.fill")
        })
        .buttonStyle(IconButtonStyle())
        .padding(.trailing, ViewConstants.PADDING_M)
        .padding(.top, ViewConstants.PADDING_M)
    }
  }
}

struct WebRTCTopNavigationView_Previews: PreviewProvider {
    static var previews: some View {
        WebRTCTopNavigationView(
          viewModel: WebRTCViewModel(),
          showInfo: .constant(false),
          showSettings: .constant(false))
    }
}
