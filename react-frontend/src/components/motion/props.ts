/**
 * @fileoverview Defines {Motion} module.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Stage from './stage';

/** Defines motion names. */
export type Name =
  | string
  | {
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
  element: HTMLElement
) => Promise<void> | void;

/** Motion start handlers. */
export type StartEventHandler = (
  element: HTMLElement,
  event: Event
) => React.CSSProperties | void;

/** Motion active handlers. */
export type ActiveEventHandler = StartEventHandler;

/** Motion end handlers. */
export type DoneEventHandler = (
  element: HTMLElement,
  event: Event
) => boolean | void;

/** Transition name mapper. */
export type Transition = (
  name: Name,
  status: Stage.Status,
  cue: Stage.Cue
) => string;

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
type Children = (
  context: Context,
  ref: (node: unknown) => void
) => React.ReactNode;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventProps?: any;
  ref?: React.Ref<unknown>;
  children?: Children;
}

/** A {Motions} component properties. */
export interface List
  extends Omit<Motion, 'onVisibleChanged'>,
    Omit<React.HTMLAttributes<unknown>, 'children'> {
  keys: (React.Key | { key: React.Key; [name: string]: unknown })[];
  onVisibleChanged?: (visible: boolean, info: { key: React.Key }) => void;
}
