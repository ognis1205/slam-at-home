/**
 * @fileoverview Defines {Motion} module.
 * @copyright Shingo OKAWA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from 'react';
import * as Stage from './stage';

/** Defines motion names. */
export type Name = string | {
  appear?: string;
  enter?: string;
  exit?: string;
};

/** Motion events. */
export type Event = (TransitionEvent | AnimationEvent) & {
  deadline?: boolean;
};

/** Motion prepare handlers. */
export type PrepareEventHandler = (
  element: HTMLElement,
) => Promise<any> | void;

/** Motion start handlers. */
export type StartEventHandler = (
  element: HTMLElement,
  event: Event,
) => React.CSSProperties | void;

/** Motion active handlers. */
export type ActiveEventHandler =
  StartEventHandler;

/** Motion end handlers. */
export type DoneEventHandler = (
  element: HTMLElement,
  event: Event,
) => boolean | void;

/** Transition name mapper. */
export type Transition =
  (name: Name, status: Stage.Status, cue: Stage.Cue) => string;

/** A {Motion} configs. */
export interface Config {
  name: Name;
  transition?: Transition;
  exitedClassName?: string;
  onVisibleChanged?: (visible: boolean) => void;
  onAppearPrepare?: PrepareEventHandler;
  onEnterPrepare?: PrepareEventHandler;
  onExitPrepare?: PrepareEventHandler;
  onAppearStart?: StartEventHandler;
  onEnterStart?: StartEventHandler;
  onExitStart?: StartEventHandler;
  onAppearActive?: ActiveEventHandler;
  onEnterActive?: ActiveEventHandler;
  onExitActive?: ActiveEventHandler;
  onAppearDone?: DoneEventHandler;
  onEnterDone?: DoneEventHandler;
  onExitDone?: DoneEventHandler;
}

/** A {Context} component properties. */
export interface Context {
  visible?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

/** A type union of a component's children. */
type Children =
  (context: Context, ref: (node: unknown) => void) => React.ReactNode;

/** A {Motion} component properties. */
export interface Motion extends Partial<Config> {
  visible?: boolean;
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
  exitImmediately?: boolean;
  deadline?: number;
  forceRender?: boolean;
  removeOnExit?: boolean;
  ref?: React.Ref<unknown>;
  children?: Children;
}
