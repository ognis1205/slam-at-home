<p align="center">
  <img height="128" width="128" src="./docs/images/logo.png">
</p>
<p align="center">
  <a href="https://www.buymeacoffee.com/ognis1205">
    <img width="128" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" />
  </a>
</p>

SLAM@HOME
==============================
An implementation of a real-time SLAM system on your local Wi-Fi network.

<p align="center">
  <img width="256" src="./docs/images/mobile.gif">
</p>

Implementation Notes
==============================
 - React/Frontend
   All components are built upon vanilla React
   Refactor things messy disaster spaghetti redundant inconsistent abstraction

 - iOS/Camera
   WebRTC is Google reference implementation
 
 - Wgpu/Core
   Rust?
   
 - Express/Signaling
   Minimum implementation

TODO
==============================
 - LiDAR over DataChannel
 - Recording
 - WebGPU engine
 - Android
 - Manage CMSampleBuffer
 Use current AVCaptureSession on WebRTC on iOS devices
 https://groups.google.com/g/discuss-webrtc/c/8TgRy9YWvVc
 https://stackoverflow.com/questions/28265880/use-current-avcapturesession-on-webrtc-on-ios-devices
