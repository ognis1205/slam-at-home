/**
 * @fileoverview Defines {Players} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import type * as THREE from 'three';
import * as Types from '../../utils/types';
import * as WebGL from '../../utils/webgl';

/** A {Video} component properties. */
export type Video = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    stream?: MediaStream;
  }
>;

/** WebGL uniforms for scene. */
export type SceneUniforms = {
  colormap: WebGL.Uniform<THREE.Texture>;
  width: WebGL.Uniform<number>;
  height: WebGL.Uniform<number>;
  nearClipping: WebGL.Uniform<number>;
  farClipping: WebGL.Uniform<number>;
  pointSize: WebGL.Uniform<number>;
  zOffset: WebGL.Uniform<number>;
};

/** WebGL scene properties. */
export type Scene = Types.Overwrite<
  SceneUniforms,
  {
    fps?: number;
    vertexShader?: string;
    fragmentShader?: string;
  }
>;

/** WebGL camera properties. */
export type Camera = {
  fov: number;
  aspect: number;
  nearPlane: number;
  farPlane: number;
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  zoomSpeed?: boolean;
  enableKeys?: boolean;
  screenSpacePanning?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
};

/** A {Scene} component properties. */
export type Scene = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
//    video: HTMLVideoElement;
    width: number;
    height: number;
//    scene: THREE.Scene;
//    origin: THREE.Vector3;
    uniforms: SceneUniforms;
//    texture: THREE.Texture;
  }
>;
