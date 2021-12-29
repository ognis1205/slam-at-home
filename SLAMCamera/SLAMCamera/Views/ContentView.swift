//
//  ContentView.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/26.
//  Copyright © 2021 Shingo OKAWA. All rights reserved.
//
import SwiftUI

struct ContentView: View {
  /// Business logics here.
  @StateObject var model = CameraModel()

  /// Content body.
  var body: some View {
    GeometryReader { reader in
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        VStack {
          HStack {
            Button(
              action: {
                //model.switchFlash()
              },
              label: {
                Image(systemName: model.hasConnection ? "wifi.circle.fill" : "wifi.circle")
                  .font(.system(size: 20, weight: .medium, design: .default))
              }
            ).accentColor(model.hasConnection ? .red : .white)
            Text(model.URL)
          }
          PreviewView(avCaptureSession: model.avCaptureSession)
            .gesture(DragGesture().onChanged({ (val) in
              if abs(val.translation.height) > abs(val.translation.width) {
                //let percentage: CGFloat = -(val.translation.height / reader.size.height)
                //let calc = currentZoomFactor + percentage
                //let zoomFactor: CGFloat = min(max(calc, 1), 5)
                //currentZoomFactor = zoomFactor
                //model.zoom(with: zoomFactor)
              }
            }))
            .onAppear {
              model.configure()
            }
            .alert(
              isPresented: $model.showAlert,
              content: {
                Alert(
                  title: Text(model.alert.title),
                  message: Text(model.alert.message),
                  dismissButton: .default(Text(model.alert.primaryButtonTitle),
                                          action: { model.alert.primaryAction?()}
                  )
                )
              }
            )
        }
      }
    }
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}
