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

  var size: CGFloat = 16
  
  var padding: CGFloat = 8
  
  var textColor: Color = .white

  var onToggleColor: Color = Color.uiGreenColor
  
  var offToggleColor: Color = Color.fontColor
  
  // MARK: Methods

  func makeBody(configuration: Configuration) -> some View {
    HStack {
      configuration.label
      Spacer()
      RoundedRectangle(cornerRadius: size)
        .stroke(configuration.isOn ? onToggleColor : offToggleColor, lineWidth: padding)
        .frame(width: size * 2, height: size, alignment: .center)
        .overlay((
          Image(
            systemName: configuration.isOn ? "wifi.circle.fill" : "xmark.circle.fill")
            .font(.system(size: size))
            .foregroundColor(textColor)
            .offset(x: configuration.isOn ? size / 2 : -1 * (size / 2), y: 0)
            .animation(.linear, value: configuration.isOn)
        ))
        .background(configuration.isOn ? onToggleColor : offToggleColor)
        .onTapGesture(perform: {
          configuration.isOn.toggle()
        })
    }
  }
}
