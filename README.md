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
An implementation of a real-time SLAM system over a local Wi-Fi network. This project was initially started for my self-learning purpose so the implementation is not production ready and may include performance issues and/or edge cases but I still believe this can be a code example for something like a DIY 3D scanner project or a DIY 3D survelliance system. Hope you will like it.

<p align="center" float="left">
  <img width="256" src="./docs/images/mobile.gif">
  <img width="384" src="./docs/images/pc.gif">
</p>

Implementation Notes
==============================
 1. **React/Frontend**

	All components (except the markdown parser and social buttons) are built using vanilla React. 

 2. **Express/Signaling**

	This is the possibly simplest implementation of a signaling server for WebRTC. It only provides the minimal set of functionalities required to exchange Session Description Protocols for establishing peer connections.

 3. **iOS/Camera**

	A monocular depth estimater/sampler implementation for iOS. The estimated and/or sampled depth data is streamed via a peer connection to the frontend. The WebRTC SDK is GoogleWebRTC and the depth estimation is based on a machine learning model for now [4/17/2022] but this **will be replaced with LiDAR camera** due to the incompatible design of the SDK with AVFoundation causing performance issues. **App Transport Security restrictions are disabled** since the system is supposed to be deployed only on your local network.
   
 4. **MLModels**

	A collection of machine learning models which is used for iOS/Camera. This directory may be deprecated someday due to the reasons mentioned above.
 
 5. **Wgpu/Core**

	The SLAM core engine for reconstructing 3D models from the video stream. The engine will be implemented in Rust.

TODO
==============================

The following is a checklist of features and their progress:
- [ ] Documentation
  - [x] README
  - [ ] Wiki
- [ ] DevOps
  - [x] Dockerfile
  - [ ] Kubernetes
- [ ] React/Frontend
  - [x] WebRTC
  - [ ] SLAM
  - [ ] SfM
- [x] Express/Signaling
  - [x] WebRTC Signaling
  - [x] Device Detection
- [ ] iOS/Camera
  - [x] ML based Depth Sampler
  - [ ] CPU Monitor
  - [ ] LiDAR Camera over DataChannel
- [x] MLModels
  - [x] Pydnet
- [ ] Wgpu/Core
  - [ ] SLAM engine
- [ ] Android
- [ ] Video Server
  - [ ] Recording
