//
//  WebRTCSettingsRowView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/14.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCSettingsRowView: View {
  // MARK: Properties
  
  var name: String
  
  var content: String?
  
  var linkLabel: String?

  var linkDestination: String?
  
  // MARK: Body

  var body: some View {
    VStack {
      Divider().padding(.vertical, 4)
      HStack {
        Text(name).foregroundColor(.gray)
        Spacer()
        if let content = content {
          Text(content)
        } else if
          let linkLabel = linkLabel,
          let linkDestination = linkDestination,
          let destination = URL(string: "https://\(linkDestination)") {
          Link(linkLabel, destination: destination).foregroundColor(.primary)
          Image(systemName: "arrow.up.right.square").foregroundColor(.pink)
        } else {
          EmptyView()
        }
      }
    }
  }
}

struct WebRTCSettingsRowView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCSettingsRowView(name: "Developer", content: "Shingo OKAWA")
  }
}
