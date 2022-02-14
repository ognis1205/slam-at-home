//
//  WebRTCSettingsLabelView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/14.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCSettingsLabelView: View {
  // MARK: Properties
  
  var labelText: String
  
  var labelImage: String
  
  // MARK: Body

  var body: some View {
    HStack {
      Text(labelText.uppercased()).fontWeight(.bold)
      Spacer()
      Image(systemName: labelImage)
    }
  }
}

struct WebRTCSettingsLabelView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsLabelView(labelText: "Fructus", labelImage: "info.circle")
  }
}
