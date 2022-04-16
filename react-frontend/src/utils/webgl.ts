/**
 * @fileoverview Defines WebGL helper classes/functions.
 * @copyright Shingo OKAWA 2021
 */
import * as THREE from 'three';
import * as DOM from './dom';
import * as Types from './types';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import magma from '../shaders/magma.frag';
import magma2depth from '../shaders/magma2depth.vert';

/** Returns `true` if WebGL APIs are available. */
export const isDefined = (): boolean => {
  if (DOM.isDefined()) {
    const canvas = document.createElement('canvas');
    const result =
      !!window.WebGLRenderingContext &&
      !!canvas.getContext('experimental-webgl');
    canvas.remove();
    return result;
  }
  return false;
};

/** Returns the depth of a given combination of width, height and fov. */
export const depthOf = (width: number, height: number, fov: number): number =>
  Math.max(width, height) / 2 / Math.tan((fov * (Math.PI / 180)) / 2);

/** Returns the center of a given combination of width and height. */
export const centerOf = (
  width: number,
  height: number
): { x: number; y: number } => {
  return { x: (width - 1.0) / 2.0, y: (height - 1.0) / 2.0 };
};

/** A type union of WebGL uniform types. */
type UniformType = {
  t: THREE.Texture;
  f: number;
  fv: number[];
  i: number;
  iv: number[];
};

export type Uniform = Types.TypeValue<UniformType>;

/** WebGL uniforms for scene. */
export type SceneUniforms = {
  colormap: Uniform;
  width: Uniform;
  height: Uniform;
  offset: Uniform;
  centerX: Uniform;
  centerY: Uniform;
  depth: Uniform; // in pixel
  pointSize: Uniform;
};

/** WebGL camera properties. */
export type CameraConfig = {
  fov: number;
  aspect: number;
  width: number;
  height: number;
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  zoomSpeed?: number;
  enableKeys?: boolean;
  screenSpacePanning?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
};

/** WebGL scene properties. */
export type SceneConfig = Types.Overwrite<
  SceneUniforms,
  {
    fps?: number;
    vertexShader?: string;
    fragmentShader?: string;
  }
>;

/** WebGL renderer properties. */
export type RendererConfig = {
  width: number;
  height: number;
  antiAlias?: boolean;
};

/** WebGL rendering context. */
export type Context = {
  renderer: Renderer;
  camera: Camera;
  scene: Scene;
};

/** Represents WebGL camera. */
export class Camera {
  /** Holds a camera for projection. */
  public readonly instance: THREE.PerspectiveCamera;

  /** Holds a width of the frame. */
  private width: number;

  /** Holds a height of the frame. */
  private height: number;

  /** OrbitControls. */
  private controls: OrbitControls;

  /** OrbitControls option. */
  private enableDamping: boolean;

  /** OrbitControls option. */
  private dampingFactor: number;

  /** OrbitControls option. */
  private enableZoom: boolean;

  /** OrbitControls option. */
  private zoomSpeed: number;

  /** OrbitControls option. */
  private enableKeys: boolean;

  /** OrbitControls option. */
  private screenSpacePanning: boolean;

  /** OrbitControls option. */
  private enableRotate: boolean;

  /** OrbitControls option. */
  private enablePan: boolean;

  /** Constructor. */
  constructor({
    fov,
    aspect,
    width,
    height,
    enableDamping = true,
    dampingFactor = 1,
    enableZoom = true,
    zoomSpeed = 0.1,
    enableKeys = false,
    screenSpacePanning = false,
    enableRotate = true,
    enablePan = false,
  }: CameraConfig) {
    this.instance = new THREE.PerspectiveCamera(fov, aspect);
    this.width = width;
    this.height = height;
    this.enableDamping = enableDamping;
    this.dampingFactor = dampingFactor;
    this.enableZoom = enableZoom;
    this.zoomSpeed = zoomSpeed;
    this.enableKeys = enableKeys;
    this.screenSpacePanning = screenSpacePanning;
    this.enableRotate = enableRotate;
    this.enablePan = enablePan;
  }

  /** Starts a WebGL camera. */
  public start(object: THREE.Object3D, domElement: HTMLElement): void {
    const c = centerOf(this.width, this.height);
    const z = depthOf(this.width, this.height, this.instance.fov);
    this.instance.position.set(c.x, c.y, z);
    this.instance.far = z * 10;
    this.instance.lookAt(c);
    this.instance.updateProjectionMatrix();
    this.controls = new OrbitControls(this.instance, domElement);
    this.controls.enableDamping = this.enableDamping;
    this.controls.dampingFactor = this.dampingFactor;
    this.controls.enableZoom = this.enableZoom;
    this.controls.zoomSpeed = this.zoomSpeed;
    this.controls.enableKeys = this.enableKeys;
    this.controls.screenSpacePanning = this.screenSpacePanning;
    this.controls.enableRotate = this.enableRotate;
    this.controls.enablePan = this.enablePan;
    this.controls.target.set(c.x, c.y, c.z);
    this.controls.update();
  }

  /** Stops WebGL camera. */
  public stop(): void {
    // Do nothing.
  }
}

/** Represents WebGL scene. */
export class Scene {
  /** Holds a scene for projection. */
  public readonly instance: THREE.Scene;

  /** Holds a props. */
  private uniforms: SceneUniforms;

  /** Holds a frame per second rate. */
  private fps: number;

  /** Holds a vertex shader. */
  private vertexShader: string;

  /** Holds a fragment shader. */
  private fragmentShader: string;

  /** Holds an interval object. */
  private interval: ReturnType<typeof setInterval>;

  /** Constructor. */
  constructor({
    fps = 30,
    vertexShader = magma2depth,
    fragmentShader = magma,
    ...uniforms
  }: SceneConfig) {
    this.instance = new THREE.Scene();
    this.fps = fps;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.uniforms = uniforms;
  }

  /** Starts a WebGL scene. */
  public start(video: HTMLVideoElement): THREE.Object3D {
    const vertices = [];
    for (
      let i = 0;
      i < this.uniforms.width.value * this.uniforms.height.value;
      i++
    ) {
      const v = new THREE.Vector3();
      v.x = i % this.uniforms.width.value;
      v.y = Math.floor(i / this.uniforms.width.value);
      vertices.push(v);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const mesh = new THREE.Points(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;

    this.instance.add(mesh);
    this.interval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        this.uniforms.colormap.value.needsUpdate = true;
      }
    }, 1000 / this.fps);

    return mesh;
  }

  /** Stops WebGL scene. */
  public stop(): void {
    if (this.interval) clearInterval(this.interval);
  }
}

/** Represents WebGL renderer. */
export class Renderer {
  /** Holds a scene for projection. */
  public readonly instance: THREE.WebGLRenderer;

  /** Constructor. */
  constructor({
    width,
    height,
    antiAlias = true,
  }: SceneConfig) {
    this.instance = new THREE.WebGLRenderer({ antialias: antiAlias });
    this.instance.setSize(width, height);
  }

  /** Starts a WebGL renderer. */
  public render(scene: Scene, camera: Camera): void {
    this.instance.render(scene.instance, camera.instance);
  }

  /** Stops WebGL renderer. */
  public stop(): void {
    if (this.instance) this.instance.forceContextLoss();
  }

  /** Returns a canvas element which is associated with this renderer. */
  public getDOMElement(): HTMLElement {
    return this.instance.domElement;
  }
}
