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

/**
 * Defines motion names.
 * - Appear: when you want transition on component first mount (like when you refresh a page).
 * - Enter : transition when a new element has mounted.
 * - Exit  : when element un-mounts.
 */
export type Name = string | {
  appear?: string;
  enter?: string;
  exit?: string;
  appearActive?: string;
  enterActive?: string;
  exitActive?: string;
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
export type EventHandler = (
  element: HTMLElement,
  event: Event,
) => React.CSSProperties | void;

/** Motion end handlers. */
export type EndEventHandler = (
  element: HTMLElement,
  event: Event,
) => boolean | void;

/** A {Context} component properties. */
export interface Context {
  visible?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

/** A type union of a component's children. */
type Children =
  ((context: Context, ref: (node: unknown) => void) => React.ReactNode) | React.ReactNode;

/** A {Motion} component properties. */
export interface Motion {
  name?: Name;
  visible?: boolean;
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
  exitImmediately?: boolean;
  deadline?: number;
  forceRender?: boolean;
  removeOnExit?: boolean;
  exitedClassName?: string;
  onVisibleChanged?: (visible: boolean) => void;
  onAppearPrepare?: PrepareEventHandler;
  onEnterPrepare?: PrepareEventHandler;
  onExitPrepare?: PrepareEventHandler;
  onAppearStart?: EventHandler;
  onEnterStart?: EventHandler;
  onExitStart?: EventHandler;
  onAppearActive?: EventHandler;
  onEnterActive?: EventHandler;
  onExitActive?: EventHandler;
  onAppearEnd?: EndEventHandler;
  onEnterEnd?: EndEventHandler;
  onExitEnd?: EndEventHandler;
  ref?: React.Ref<unknown>;
  children?: Children;
}
