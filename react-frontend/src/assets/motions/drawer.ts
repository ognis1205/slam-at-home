/**
 * @fileoverview Defines {Drawer} motions.
 * @copyright Shingo OKAWA 2022
 */
import * as Motion from '../../components/motion';

/** Returns collapse height. */
const getCollapsedHeight: Motion.StartEventHandler = () => ({
  height: 0,
  opacity: 0,
});

/* Returns real height. **/
const getRealHeight: Motion.ActiveEventHandler = (node) => ({
  height: node.scrollHeight,
  opacity: 1,
});

/** Returns current height. */
const getCurrentHeight: Motion.StartEventHandler = (node) => ({
  height: node.offsetHeight,
});

/** Skips opacity transition. */
const skipOpacityTransition: Motion.DoneEventHandler = (_, event) =>
  (event as TransitionEvent).propertyName === 'height';

/** Motion for drawer collapse. */
export default {
  name: 'motion',
  onEnterStart: getCollapsedHeight,
  onEnterActive: getRealHeight,
  onEnterDone: skipOpacityTransition,
  onExitStart: getCurrentHeight,
  onExitActive: getCollapsedHeight,
  onExitDone: skipOpacityTransition,
  deadline: 500,
} as Motion.Props;
