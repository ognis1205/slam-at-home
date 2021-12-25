//
//  ContentView.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/26.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
      Text("Hello, world! \(IP.getAddress())")
            .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
