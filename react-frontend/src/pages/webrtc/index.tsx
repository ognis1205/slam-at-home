/**
 * @fileoverview Defines webrtc page.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Next from 'next';
import * as THREE from 'three';
import * as Forms from '../../components/forms';
import * as Players from '../../components/players';
import * as Store from '../../redux/store';
import * as Event from '../../utils/event';
import * as WebGL from '../../utils/webgl';
import styles from '../../assets/styles/pages/webrtc.module.scss';

/** Type alias for trackers. */
type TrackProps = typeof Forms.RangeContext['getTrackprops'];

/** Type alias for trackers. */
type Handles = typeof Forms.RangeContext['handle'];

/** Returns a `Display` component. */
const Display: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement> & {
    stream: MediaStream;
    handleLoadedMetadata: (e: Event, video: HTMLVideoElement) => void;
    webGL: WebGL.Context;
    pointSize: number;
    pointSizeTrackProps: TrackProps;
    pointSizeHandles: Handles;
    depth: number;
    depthTrackProps: TrackProps;
    depthHandles: Handles;
  }
> = ({
  stream,
  handleLoadedMetadata,
  webGL,
  pointSize,
  pointSizeTrackProps,
  pointSizeHandles,
  depth,
  depthTrackProps,
  depthHandles,
  ...divAttrs
}: React.HTMLAttributes<HTMLDivElement> & {
  stream: MediaStream;
  handleLoadedMetadata: (e: Event, video: HTMLVideoElement) => void;
  webGL: WebGL.Context;
  pointSize: number;
  pointSizeTrackProps: TrackProps;
  pointSizeHandles: Handles;
  depth: number;
  depthTrackProps: TrackProps;
  depthHandles: Handles;
}): React.ReactElement => {
  return (
    <div {...divAttrs} className={styles['display']}>
      <Players.Video
        className={styles['original']}
        stream={stream}
        onLoadedMetadata={handleLoadedMetadata}
      />
      {webGL ? (
        <Players.Projector className={styles['webgl']} context={webGL} />
      ) : null}
      <div className={styles['sliders']}>
        <div className={styles['slider']}>
          <div className={styles['name']}>
            WebGL Point Size: {Number(Number(pointSize).toFixed(1))}
          </div>
          <div className={styles['track']} {...pointSizeTrackProps({})}>
            {pointSizeHandles.map(({ getHandleProps }, i) => (
              <button
                key={i}
                className={styles['handle']}
                {...getHandleProps({})}
              />
            ))}
          </div>
        </div>
        <div className={styles['slider']}>
          <div className={styles['name']}>WebGL Depth: {depth}</div>
          <div className={styles['track']} {...depthTrackProps({})}>
            {depthHandles.map(({ getHandleProps }, i) => (
              <button
                key={i}
                className={styles['handle']}
                {...getHandleProps({})}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Sets the component's display name. */
Display.displayName = 'Display';

/** Returns a '/webrtc' page. */
const WebRTC: Next.NextPage = () => {
  /** @const Holds a Redux state of the p2p module. */
  const rtcStore = ReactRedux.useSelector((store: Store.Type) => store.rtc);

  /** @const Holds a WebGL rendering point sizes. */
  const [pointSize, setPointSize] = React.useState([1.0]);

  /** @const Holds a WebGL rendering depth. */
  const [depth, setDepth] = React.useState([1000]);

  /** @const Holds a WebGL rendering context. */
  const [webGL, setWebGL] = React.useState<WebGL.Context>(null);

  /** Updates point size of the rendering. */
  React.useEffect(() => {
    if (webGL) webGL.scene.material.uniforms.pointSize.value = pointSize[0];
  }, [webGL, pointSize]);

  /** Updates depth of the rendering. */
  React.useEffect(() => {
    if (webGL) webGL.scene.material.uniforms.depth.value = depth[0];
  }, [webGL, depth]);

  /** @const Defines a WebGL rendering point size tracker. */
  const { getTrackProps: pointSizeTrackProps, handles: pointSizeHandles } =
    Forms.useRange({
      min: 1.0,
      max: 5.0,
      step: 0.1,
      values: pointSize,
      onChange: setPointSize,
    });

  /** @const Defines a WebGL rendering depth tracker. */
  const { getTrackProps: depthTrackProps, handles: depthHandles } =
    Forms.useRange({
      min: 500,
      max: 5000,
      step: 100,
      values: depth,
      onChange: setDepth,
    });

  /** An event handler called on 'loadedmetadata' events. */
  const handleLoadedMetadata = (e: Event, video: HTMLVideoElement): void => {
    const texture = new THREE.VideoTexture(video);

    const fov = 60; // iPhone

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
      depth: { type: 'f', value: depth[0] },
      pointSize: { type: 'f', value: pointSize[0] },
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

  const content = rtcStore.stream ? (
    <Display
      stream={rtcStore.stream}
      handleLoadedMetadata={handleLoadedMetadata}
      webGL={webGL}
      pointSize={pointSize[0]}
      pointSizeTrackProps={pointSizeTrackProps}
      pointSizeHandles={pointSizeHandles}
      depth={depth[0]}
      depthTrackProps={depthTrackProps}
      depthHandles={depthHandles}
    />
  ) : (
    <Players.NoSignal />
  );

  return (
    <div className={styles['webrtc']}>
      {content}
    </div>
  );
};

export default WebRTC;
