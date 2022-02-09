//
//  HLSView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/01/23.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct HLSView: View {
  @ObservedObject var viewModel: HLSViewModel = HLSViewModel()
  
  @State private var showSettings: Bool = false

  // swiftlint:disable identifier_name
  func Status() -> some View {
    return HStack {
      Button(
        action: { /* Do nothing. */ },
        label: {
          Image(systemName: self.viewModel.label)
            .font(.system(size: 20, weight: .medium, design: .default))
        })
        .accentColor(self.viewModel.color)
      Text(self.viewModel.URL)
    }
  }

  var body: some View {
    GeometryReader { reader in
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        VStack {
          Status()
          HLSVideoView(model: viewModel.model)
            .onAppear { viewModel.start() }
            .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
        }
      }
    }
  }
}

struct HLSView_Previews: PreviewProvider {
  static var previews: some View {
    HLSView()
  }
}
