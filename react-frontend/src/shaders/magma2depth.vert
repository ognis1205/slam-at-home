/**
 * @fileoverview Defines Magma colormap to RGBD vertex shader.
 * @copyright Shingo OKAWA 2022
 */

/** Converts a RGB color to a XYZ color coordinate. */
vec3 rgb2xyz(vec3 rgb) {
  vec3 v;
  v.x = rgb.r > 0.04045 ? pow((rgb.r + 0.055) / 1.055, 2.4) : rgb.r / 12.92;
  v.y = rgb.g > 0.04045 ? pow((rgb.g + 0.055) / 1.055, 2.4) : rgb.g / 12.92;
  v.z = rgb.b > 0.04045 ? pow((rgb.b + 0.055) / 1.055, 2.4) : rgb.b / 12.92;
  mat3 M = mat3(
    0.4124, 0.3576, 0.1805,
    0.2126, 0.7152, 0.0722,
    0.0193, 0.1192, 0.9505);
  return 100.0 * v * M;
}

/** Converts a XYZ color to a LAB color coordinate. */
vec3 xyz2lab(vec3 xyz) {
  vec3 v;
  vec3 n = xyz / vec3(95.047, 100, 108.883);
  v.x = n.x > 0.008856 ? pow(n.x, 1.0 / 3.0) : (7.787 * n.x) + (16.0 / 116.0);
  v.y = n.y > 0.008856 ? pow(n.y, 1.0 / 3.0) : (7.787 * n.y) + (16.0 / 116.0);
  v.z = n.z > 0.008856 ? pow(n.z, 1.0 / 3.0) : (7.787 * n.z) + (16.0 / 116.0);
  return vec3((116.0 * v.y) - 16.0, 500.0 * (v.x - v.y), 200.0 * (v.y - v.z));
}

/** Converts a RGB color to a LAB color coordinate. */
vec3 rgb2lab(vec3 rgb) {
  vec3 lab = xyz2lab(rgb2xyz(rgb));
  return vec3(lab.x / 100.0, 0.5 + 0.5 * (lab.y / 127.0), 0.5 + 0.5 * (lab.z / 127.0));
}

//attribute vec3 position;

/** A magma colormap input sent from a video.*/
uniform sampler2D colormap;

/** A width of screen space. */
uniform float width;

/** A height of screen space. */
uniform float height;

/** Defines depth clipping. */
uniform float nearClipping, farClipping;

/** A rasterized diameter of points. */
uniform float pointSize;

/** A z-offset. */
uniform float zOffset;

/** A pixel color. */
varying vec2 vUv;

/** tan( 1.0144686 / 2.0 ) * 2.0 */
const float XtoZ = 1.11146;

/** tan( 0.7898090 / 2.0 ) * 2.0 */
const float YtoZ = 0.83359;

/**
 * We use a magma colormap to represent a depth image, hence, the resulting L* component
 * is proportional (linear correspondence) to the depth and the range is between 0 and 100.
 * We use this correspondence to acquire the z-coordinate from the texture.
 */
void main() {
  vUv = vec2(position.x / width, position.y / height);
  vec4 rgb = texture2D(colormap, vUv);
  vec3 lab = rgb2lab(rgb.rgb);
  vec4 coord = vec4(
    position.x,
    position.y,
    lab.x * 500.0,
    1.0);
  gl_PointSize = pointSize;
  gl_Position  = projectionMatrix * modelViewMatrix * coord;
}
