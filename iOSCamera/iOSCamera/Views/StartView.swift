//
//  StartView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/19.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI

struct StartView: View {
  // MARK: Properties
  
  @Binding var isRecording: Bool

  @State private var opacity: CGFloat = 1.0

  // MARK: Body

  var body: some View {
    ZStack {
      Color.themeColor
          .ignoresSafeArea()
      VStack {
        Button(
          action: {
            isRecording = true
          },
          label: {
            VStack {
              HStack {
                Text("SLAM@HOME")
                  .font(.largeTitle)
                  .fontWeight(.black)
                  .foregroundColor(.white)
                Image(systemName: "video.fill")
                  .imageScale(.large)
                  .foregroundColor(.white.opacity(opacity))
              }
              Text("Tap to Start")
                .font(.caption)
                .fontWeight(.black)
                .foregroundColor(.white)
            }
          })
          .onAppear {
            withAnimation {
              opacity = 0.0
            }
          }
          .animation(
            Animation.easeInOut(duration: 1).repeatForever(autoreverses: true),
            value: opacity)
      }
    }
  }
}

struct StartView_Previews: PreviewProvider {
  // MARK: Previews

  static var previews: some View {
    StartView(isRecording: .constant(false))
  }
}
