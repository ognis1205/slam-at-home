//
//  WebRTCStatus.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/16.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCStatus: View {
  // MARK: Properties
  
  @ObservedObject var viewModel: WebRTCViewModel

  @State private var opacity: CGFloat = 0.0
  
  // MARK: Body

  var body: some View {
    HStack {
      Button(
        action: { /* Do nothing. */ },
        label: {
          Text(viewModel.status)
            .foregroundColor(.black.opacity(opacity))
            .fontWeight(.semibold)
            .padding(.vertical, 10)
            .padding(.horizontal, 20)
            .background(.white.opacity(opacity))
            .clipShape(Capsule())
            .onAppear {
              withAnimation {
                opacity = 0.5
              }
            }
            .animation(
              Animation.easeInOut(duration: 1).repeatForever(autoreverses: true),
              value: opacity)
        })
        .disabled(true)
        .padding(.leading)
      Spacer()
    }
    .frame(height: 75)
  }
}

struct WebRTCStatus_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCStatus(viewModel: WebRTCViewModel())
  }
}
