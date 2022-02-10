//
//  Debuggable.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/10.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation

protocol Describable {
  // MARK: Properties

  var typeName: String { get }

  static var typeName: String { get }
}

extension Describable {
  // MARK: Properties

  var typeName: String {
    return String(describing: type(of: self))
  }

  static var typeName: String {
    return String(describing: self)
  }
}

protocol Debuggable: Describable {
  // MARK: Methods

  func info(_ message: String)
  
  func warn(_ message: String)
  
  func error(_ message: String)
  
  func fatal(_ message: String)
}

extension Debuggable {
  // MARK: Methods
 
  func info(_ message: String) {
    print("[INFO] \(self.typeName): \(message)")
  }
  
  func warn(_ message: String) {
    print("[WARN] \(self.typeName): \(message)")
  }
  
  func error(_ message: String) {
    print("[ERROR] \(self.typeName): \(message)")
  }
  
  func fatal(_ message: String) {
    fatalError("[FATAL] \(self.typeName): \(message)")
  }
}
