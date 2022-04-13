/**
 * @fileoverview Defines WebGL scene.
 * @copyright Shingo OKAWA 2022
 */
import * as THREE from 'three';
import * as Props from './props';
import magma from '../../shaders/magma.frag';
import magma2depth from '../../shaders/magma2depth.vert';

/** Represents WebGL scene. */
export class Scene {
  /** Holds a scene for projection. */
  public readonly instance: THREE.Scene;

  /** Holds a props. */
  private uniforms: Props.SceneUniforms;

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
  }: Props.Scene) {
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
