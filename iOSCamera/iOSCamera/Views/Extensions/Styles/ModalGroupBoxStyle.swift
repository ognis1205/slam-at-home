//
//  ModalGroupBoxStyle.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/04/05.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct ModalGroupBoxStyle: GroupBoxStyle {
  // MARK: Methods

  func makeBody(configuration: Configuration) -> some View {
    ZStack {
      Color.uiColor
      GeometryReader { geometry in
        Image("Logo")
            .resizable()
            .aspectRatio(contentMode: .fit)
            .edgesIgnoringSafeArea(.all)
      }
      VStack(alignment: .center) {
        configuration.label
        GeometryReader { geometry in
          configuration.content
            .frame(width: 3 * geometry.size.width / 4)
            .position(x: geometry.frame(in: .local).midX, y: geometry.frame(in: .local).midY)
        }
      }
      .foregroundColor(Color.fontColor)
    }
  }
}
