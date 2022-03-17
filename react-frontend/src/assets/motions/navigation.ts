/**
 * @fileoverview Defines {Navigation} motions.
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

/** Motion for navigation collapse. */
export default {
  name: 'navigation',
  onEnterStart: getCollapsedHeight,
  onEnterActive: getRealHeight,
  onExitStart: getCurrentHeight,
  onExitActive: getCollapsedHeight,
  deadline: 500,
} as Motion.Props;
