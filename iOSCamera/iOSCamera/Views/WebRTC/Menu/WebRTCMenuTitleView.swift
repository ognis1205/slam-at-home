//
//  WebRTCMenuTitleView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCMenuTitleView: View {
  // MARK: Properties
  
  var labelText: String
  
  var labelImage: String
  
  // MARK: Body

  var body: some View {
    HStack {
      Text(labelText.uppercased())
        .fontWeight(.bold)
      Spacer()
      Image(systemName: labelImage)
    }
  }
}

struct WebRTCMenuTitleView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCMenuTitleView(
      labelText: "Fructus",
      labelImage: "info.circle")
  }
}
