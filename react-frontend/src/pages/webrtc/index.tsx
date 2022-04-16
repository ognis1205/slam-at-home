/**
 * @fileoverview Defines webrtc page.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Next from 'next';
import * as THREE from 'three';
import * as Players from '../../components/players';
import * as Store from '../../redux/store';
import * as Event from '../../utils/event';
import * as WebGL from '../../utils/webgl';

/** Returns a '/webrtc' page. */
const WebRTC: Next.NextPage = () => {
  /** @const Holds a Redux state of the p2p module. */
  const rtcStore = ReactRedux.useSelector((store: Store.Type) => store.rtc);

  /** @const Holds a WebGL rendering context. */
  const [webGL, setWebGL] = React.useState<WebGL.Context>(null);

  /** An event handler called on 'loadedmetadata' events. */
  const handleLoadedMetadata = (e: Event, video: HTMLVideoElement): void => {
    const texture = new THREE.VideoTexture(video);

    const fov = 50; // 50 - 120
    const pointSize = 1.0; // 1.0 - 2.0;

    const depth = 1000;

    const offset = WebGL.depthOf(video.videoWidth, video.videoHeight, fov);

    const center = WebGL.centerOf(video.videoWidth, video.videoHeight);

    const camera = new WebGL.Camera({
      fov: fov,
      aspect: video.videoWidth / video.videoHeight,
      width: video.videoWidth,
      height: video.videoHeight,
    });

    const scene = new WebGL.Scene({
      colormap: { type: 't', value: texture },
      width: { type: 'f', value: video.videoWidth },
      height: { type: 'f', value: video.videoHeight },
      offset: { type: 'f', value: offset },
      centerX: { type: 'f', value: center.x },
      centerY: { type: 'f', value: center.y },
      depth: { type: 'f', value: depth },
      pointSize: { type: 'f', value: pointSize },
    });

    const renderer = new WebGL.Renderer({
      width: video.videoWidth,
      height: video.videoHeight,
    });

    const object = scene.start(video);
    camera.start(object, renderer.getDOMElement());

    setWebGL({
      renderer: renderer,
      camera: camera,
      scene: scene,
    });
  };

  return rtcStore.stream ? (
    <>
      <Players.Video
        stream={rtcStore.stream}
        onLoadedMetadata={handleLoadedMetadata}
      />
      {webGL ? <Players.Projector context={webGL} /> : null}
    </>
  ) : (
    <>
      <Players.NoSignal />
      <Players.NoSignal />
    </>
  );
};

export default WebRTC;
