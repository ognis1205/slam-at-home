//
//  IconButtonStyle.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/04/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct IconButtonStyle: ButtonStyle {
  // MARK: Properties
  
  var foregroundColor: Color = Color.fontColor
  
  var backgroundColor: Color = Color.uiColor
  
  var maxHeight: CGFloat = 36

  var maxWidth: CGFloat = 36

  // MARK: Methods
  
  public func makeBody(configuration: Self.Configuration) -> some View {
    configuration.label
      .frame(
        minWidth: 0,
        maxWidth: maxWidth,
        minHeight: 0,
        maxHeight: maxHeight)
      .foregroundColor(foregroundColor)
      .background(backgroundColor)
      .clipShape(Circle())
      .scaleEffect(configuration.isPressed ? 0.5 : 1.0)
  }
}
