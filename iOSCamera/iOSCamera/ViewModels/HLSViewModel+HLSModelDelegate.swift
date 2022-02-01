//
//  HLSViewModel+HLSModelDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension HLSViewModel: HLSModelDelegate {
  func didConnect() {
    self.isConnected = true
  }
  
  func didDisconnect() {
    self.isConnected = false
  }
  
  func ip(_ ip: String) {
    self.URL = "http://\(ip):\(HLSConstants.PORT)"
  }
  
  func alert() {
    self.showAlert = true
  }
}
