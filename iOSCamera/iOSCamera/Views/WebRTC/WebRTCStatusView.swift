//
//  WebRTCStatusView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/16.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCStatusView: View {
  // MARK: Properties
  
  @ObservedObject var viewModel: WebRTCViewModel

  @State private var opacity: CGFloat = 0.5
  
  // MARK: Body

  var body: some View {
      HStack {
        Button(
          action: { /* Do nothing. */ },
          label: {
            Text(viewModel.signalingState)
              .foregroundColor(viewModel.isConnected ? .red : .gray)
              .fontWeight(.semibold)
              .padding(.vertical, 10)
              .padding(.horizontal, 20)
              .background(.white.opacity(opacity))
              .clipShape(Capsule())
              .onAppear {
                withAnimation {
                  opacity = 0.0
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

struct WebRTCStatusView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCStatusView(viewModel: WebRTCViewModel())
  }
}
