//
//  HLSViewModel+HLSModelDelegate.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

extension HLSViewModel: HLSModelDelegate {
  // MARK: Methods

  func didConnect() {
    DispatchQueue.main.async {
      self.isConnected = true
    }
  }
  
  func didDisconnect() {
    DispatchQueue.main.async {
      self.isConnected = false
    }
  }
  
  func ip(_ ip: String) {
    DispatchQueue.main.async {
      self.URL = "http://\(ip):\(HLSConstants.PORT)"
    }
  }
  
  func alert(_ alert: AlertModel) {
    DispatchQueue.main.async {
      self.showAlert = true
      self.alert = alert
    }
  }
}
