//
//  WebRTCGroupBoxLabelView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCGroupBoxLabelView: View {
  // MARK: Properties
  
  var labelText: String
  
  var labelImage: String
  
  let onToggle: () -> Void
  
  // MARK: Body

  var body: some View {
    HStack {
      Image(systemName: labelImage)
        .padding([.leading, .top])
      Text(labelText.uppercased()).fontWeight(.bold)
        .padding([.top])
      Spacer()
      Button(
        action: {
          onToggle()
        },
        label: {
          Image(systemName: "xmark.circle.fill")
        })
        .buttonStyle(IconButtonStyle())
        .padding([.trailing, .top])
    }
  }
}

struct WebRTCGroupBoxLabelView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCGroupBoxLabelView(
      labelText: "Fructus",
      labelImage: "info.circle",
      onToggle: {})
  }
}
