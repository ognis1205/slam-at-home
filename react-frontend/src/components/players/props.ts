/**
 * @fileoverview Defines {Players} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Types from '../../utils/types';
import * as WebGL from '../../utils/webgl';

/** A {Video} component properties. */
export type Video = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    stream: MediaStream;
    onCanPlay?: (e: Event) => void;
    onPlay?: (e: Event) => void;
    onPause?: (e: Event) => void;
    onLoadedMetadata?: (e: Event, video: HTMLVideoElement) => void;
  }
>;

/** A {Scene} component properties. */
export type Projector = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    context: WebGL.Context;
  }
>;
