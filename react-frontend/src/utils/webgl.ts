/**
 * @fileoverview Defines WebGL helper classes/functions.
 * @copyright Shingo OKAWA 2021
 */
import * as DOM from './dom';

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
export const UniformType = {
  TEXTURE: 't',
  FLOATING_SCALAR: 'f',
  FLOATING_VECTOR: 'fv',
  INTEGER_SCALAR: 'i',
  INTEGER_VECTOR: 'iv',
} as const;

export type UniformType = typeof UniformType[keyof typeof UniformType];

/** WebGL uniform type. */
export interface Uniform<V> {
  type: UniformType;
  value: V;
}
