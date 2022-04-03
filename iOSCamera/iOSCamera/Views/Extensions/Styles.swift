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
