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
            .foregroundColor(.white)
            .padding()
            .background(Color.themeColor)
            .clipShape(Circle())
        })
        .padding(.leading, 10)
        .padding(.top, 10)
      Spacer()
      Button(
        action: {
          self.showSettings.toggle()
        },
        label: {
          Image(systemName: "slider.horizontal.3")
            .foregroundColor(.white)
            .padding()
            .background(Color.themeColor)
            .clipShape(Circle())
        })
        .padding(.trailing, 10)
        .padding(.top, 10)
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
