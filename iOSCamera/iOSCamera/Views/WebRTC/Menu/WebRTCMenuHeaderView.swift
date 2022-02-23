//
//  WebRTCMenuHeaderView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCMenuHeaderView: View {
  // MARK: Properties
  
  var labelImage: String
  
  var labelColor: Color
  
  var content: String

  // MARK: Body

  var body: some View {
    Divider()
      .padding(.vertical, 4)
    HStack(alignment: .center, spacing: 10) {
      Image(systemName: labelImage)
        .resizable()
        .scaledToFit()
        .foregroundColor(.white)
        .padding()
        .background(labelColor)
        .frame(width: 80, height: 80)
        .cornerRadius(9)
      Text(content)
        .font(.footnote)
    }
  }
}

struct WebRTCMenuHeaderView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCMenuHeaderView(
      labelImage: "network",
      labelColor: .green,
      content: "FOOBAR")
  }
}
