//
//  WebRTCPopupHeaderView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCPopupHeaderView: View {
  // MARK: Properties
  
  var labelText: String
  
  var labelImage: String
  
  @Binding var isOpen: Bool
  
  // MARK: Body

  var body: some View {
    HStack {
      Image(systemName: labelImage)
      Text(labelText.uppercased()).fontWeight(.bold)
      Spacer()
      Button(
        action: {
          isOpen.toggle()
        },
        label: {
          Image(systemName: "xmark.circle.fill")
        })
    }
  }
}

struct WebRTCPopupHeaderView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCPopupHeaderView(
      labelText: "Fructus",
      labelImage: "info.circle",
      isOpen: .constant(true))
  }
}
