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

  var size: CGFloat = ViewConstants.FONT_M
  
  var padding: CGFloat = ViewConstants.PADDING_S
  
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

struct fillButtonCircle: ViewModifier {
  // MARK: Properties

  var foregroundColor: Color = Color.fontColor
  
  var backgroundColor: Color = Color.uiColor

  var dimension: CGFloat = ViewConstants.DIMENSION

  // MARK: Methods

  func body(content: Content) -> some View {
    content
      .foregroundColor(foregroundColor)
      .padding(dimension)
      .background(backgroundColor)
      .clipShape(Circle())
      .frame(width: dimension, height: dimension)
      .overlay(
        Circle()
          .stroke(Color.primary, lineWidth: ViewConstants.BORDER_S))
  }
}

struct IconButtonStyle: ButtonStyle {
  // MARK: Properties

  var color: Color = Color.uiColor

  var maxHeight: CGFloat = ViewConstants.ICON_L

  var maxWidth: CGFloat = ViewConstants.ICON_L

  // MARK: Methods
  
  public func makeBody(configuration: Self.Configuration) -> some View {
    configuration.label
      .frame(
        minWidth: 0,
        maxWidth: maxWidth,
        minHeight: 0,
        maxHeight: maxHeight)
      .foregroundColor(Color.fontColor)
      .background(Color.uiColor)
      .clipShape(Circle())
      .opacity(configuration.isPressed ? ViewConstants.OPACITY_H : 1.0)
      .scaleEffect(configuration.isPressed ? ViewConstants.EFFECT_H : 1.0)
  }
}

struct PopupStyle: GroupBoxStyle {
  // MARK: Methods

  func makeBody(configuration: Configuration) -> some View {
    VStack(alignment: .leading) {
      configuration.label
      configuration.content
    }
    .padding(ViewConstants.PADDING_L)
    .foregroundColor(Color.fontColor)
    .background(RoundedRectangle(cornerRadius: ViewConstants.RADIUS_M).fill(Color.uiColor))
  }
}

extension Text {
  // MARK: Methods

  func withIconStyle(weight: Font.Weight, height: CGFloat, padding: CGFloat) -> some View {
    self.fontWeight(weight)
        .frame(height: height)
        .padding(.horizontal, padding)
    }
}
