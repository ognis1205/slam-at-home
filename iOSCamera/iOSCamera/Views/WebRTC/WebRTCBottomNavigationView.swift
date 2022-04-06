//
//  WebRTCBottomNavigationView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/16.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct WebRTCBottomNavigationView: View {
  // MARK: Properties
  
  @ObservedObject var viewModel: WebRTCViewModel
  
  @Binding var isRecording: Bool

  @State private var opacity: CGFloat = 0.5
  
  // MARK: Body

  var body: some View {
    HStack {
      Button(
        action: { /* Do nothing. */ },
        label: {
          Text("\(viewModel.ip) \(viewModel.signalingState)")
            .fontWeight(.semibold)
            .padding()
            .foregroundColor(viewModel.isSignaling ? .white : Color.fontColor)
            .background(
              viewModel.isSignaling ? Color.uiGreenColor.opacity(opacity) : Color.uiColor.opacity(opacity))
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
        .padding([.leading, .bottom])
      Spacer()
      Button(
        action: { isRecording = false },
        label: { Image(systemName: "video.slash.fill") })
        .buttonStyle(IconButtonStyle(inverted: true))
        .padding([.trailing, .bottom])
    }
  }
}

struct WebRTCBottomNavigationView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    WebRTCBottomNavigationView(
      viewModel: WebRTCViewModel(),
      isRecording: .constant(true))
  }
}
