//
//  WebRTCSettingsHeaderView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/15.
//

import SwiftUI

struct WebRTCSettingsHeaderView: View {
  // MARK: Properties
  
  var labelImage: String
  
  var labelColor: Color
  
  var content: String

  // MARK: Body

  var body: some View {
    Divider().padding(.vertical, 4)
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

struct WebRTCSettingsHeaderView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsHeaderView(labelImage: "network", labelColor: .green, content: "FOOBAR")
  }
}
