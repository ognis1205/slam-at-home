/**
 * @fileoverview Defines WebGL helper classes/functions.
 * @copyright Shingo OKAWA 2021
 */
import * as THREE from 'three';
import * as DOM from './dom';
import * as Types from './types';
import OrbitControls from 'three/examples/jsm/controls/OrbitControls';
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
  nearClipping: Uniform;
  farClipping: Uniform;
  pointSize: Uniform;
  zOffset: Uniform;
};

/** WebGL camera properties. */
export type CameraConfig = {
  fov: number;
  aspect: number;
  nearPlane: number;
  farPlane: number;
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
  antiAlias?: boolean;
  gammaOutput?: boolean;
  gammaFactor?: number;
};

/** Represents WebGL camera. */
export class Camera {
  /** Holds a camera for projection. */
  public readonly instance: THREE.PerspectiveCamera;

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
    nearPlane,
    farPlane,
    enableDamping = true,
    dampingFactor = 1,
    enableZoom = true,
    zoomSpeed = 0.1,
    enableKeys = false,
    screenSpacePanning = false,
    enableRotate = true,
    enablePan = false,
  }: CameraConfig) {
    this.instance = THREE.PerspectiveCamera(fov, aspect, nearPlane, farPlane);
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
  public async start(
    object: THREE.Object3D,
    domElement: HTMLElement
  ): Promise<void> {
    const box = new THREE.Box3().setFromObject(object);
    const len = (() => {
      const size = box.getSize();
      return Math.max(size.x, size.y, size.z) / 2;
    })();
    const c = box.getCenter();
    const z = len / Math.tan((this.instance.fov * (Math.PI / 180)) / 2);

    this.instance.position.z = c.z + z;
    this.instance.far = z - box.min.z;
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
  public async start(video: HTMLVideoElement): Promise<THREE.Object3D> {
    const texture = new THREE.Texture(video);

    const geometry = new THREE.Geometry();
    for (
      let i = 0;
      i < this.uniforms.width.value * this.uniforms.height.value;
      i++
    ) {
      const v = new THREE.Vector3();
      v.x = i % this.uniforms.width.value;
      v.y = Math.floor(i / this.uniforms.width.value);
      geometry.vertices.push(v);
    }

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.ParticleSystem(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;

    this.instance.add(mesh);
    this.interval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        texture.needsUpdate = true;
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
    antiAlias = true,
    gammaOutput = true,
    gammaFactor = 2.0,
  }: SceneConfig) {
    this.instance = new THREE.WebGLRenderer({ antialias: antiAlias });
    this.instance.gammaOutput = gammaOutput;
    this.instance.gammaFactor = gammaFactor;
  }

  /** Starts a WebGL renderer. */
  public start(scene: Scene, camera: Camera): void {
    this.instance.render(scene.instance, camera.instance);
  }

  /** Stops WebGL renderer. */
  public stop(): void {
    if (this.instance) {
      this.instance.forceContextLoss();
      this.instance.context = null;
      this.instance.domElement = null;
      this.instance = null;
    }
  }
}
