/**
 * @fileoverview Defines Magma colormap to RGBD fragment shader.
 * @copyright Shingo OKAWA 2022
 */

/** A magma colormap input sent from a video.*/
uniform sampler2D colormap;

/** A pixel color. */
varying vec2 vUv;

/**
 * Generates a RGBA value from the texture.
 */
void main() {
  vec4 rgb = texture2D(colormap, vUv);
  gl_FragColor = vec4(
    rgb.r,
    rgb.g,
    rgb.b,
    1.0);
}
