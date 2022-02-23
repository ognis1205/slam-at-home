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
              .foregroundColor(viewModel.isSignaling ? .white : .gray)
              .fontWeight(.semibold)
              .padding(.vertical, 10)
              .padding(.horizontal, 20)
              .background(
                viewModel.isSignaling ? .green.opacity(opacity) : .white.opacity(opacity))
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
        Button(
          action: {
            isRecording = false
          },
          label: {
            Image(systemName: "video.slash.fill")
              .foregroundColor(.white)
              .padding(10)
              .background(Color.themeColor)
              .clipShape(RoundedRectangle(cornerRadius: 10))
          })
          .padding(.trailing, 15)
      }
      .frame(height: 75, alignment: .center)
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
