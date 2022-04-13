/**
 * @fileoverview Defines WebGL camera.
 * @copyright Shingo OKAWA 2022
 */
import * as THREE from 'three';
import * as Props from './props';
import OrbitControls from 'three/examples/jsm/controls/OrbitControls';

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
  }: Props.Camera) {
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
