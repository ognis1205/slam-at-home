/**
 * @fileoverview Defines {Motion} module.
 * @copyright Shingo OKAWA 2021
 */
export type {
  Motion as Props,
  Event,
  PrepareEventHandler,
  StartEventHandler,
  ActiveEventHandler,
  DoneEventHandler,
  Config,
  Transition,
} from './props';
export { Component } from './motion';
export { Cue, Status } from './stage';
