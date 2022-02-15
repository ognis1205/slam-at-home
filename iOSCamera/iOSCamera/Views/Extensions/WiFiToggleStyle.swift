//
//  WiFiToggleStyle.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/30.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WiFiToggleStyle: ToggleStyle {
  // MARK: Properties

  static let backgroundColor = Color.secondary
  
  static let switchColor = Color(.systemBackground)
  
  // MARK: Methods

  func makeBody(configuration: Configuration) -> some View {
    HStack {
      configuration.label
      Spacer()
      RoundedRectangle(cornerRadius: 25.0)
        .frame(width: 50, height: 30, alignment: .center)
        .overlay((
          Image(systemName: configuration.isOn ? "wifi.circle.fill" : "xmark.circle.fill")
            .font(.system(size: 20))
            .foregroundColor(configuration.isOn ? .white : WiFiToggleStyle.switchColor)
            .padding(3)
            .offset(x: configuration.isOn ? 10 : -10, y: 0)
            .animation(.linear, value: configuration.isOn)
        ))
        .foregroundColor(configuration.isOn ? .green : WiFiToggleStyle.backgroundColor)
        .onTapGesture(perform: {
          configuration.isOn.toggle()
        })
    }
  }
}
