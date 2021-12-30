//
//  HttpLiveStreaming.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2021/12/30.
//
import Foundation

public protocol HttpLiveStreaming: AnyObject {
  /// Specifies whether connection is established or not.
  var id: Int { get }

  /// Data to send.
  var dataToSend: Data? { get set }
  
  /// Specifies whether connection is established or not.
  var isConnected: Bool { get }

  /// Starts the streaming session.
  func connect() -> Void
}
