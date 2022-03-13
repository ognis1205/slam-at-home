/**
 * @fileoverview Defines {Notification} motions.
 * @copyright Shingo OKAWA 2022
 */
import * as Motion from '../../components/motion';

/** Returns x-translation to hide. */
const hideX: Motion.StartEventHandler = () => ({
  transform: 'translate3d(100%, 0, 0)',
});

/* Returns x-transition to show. **/
const showX: Motion.ActiveEventHandler = (node) => ({
  transform: 'translate3d(0, 0, 0)',
});

/** Motion for notification collapse. */
export default {
  name: 'notification',
  onAppearStart: hideX,
  onAppearActive: showX,
  onExitStart: showX,
  onExitActive: hideX,
  deadline: 500,
} as Motion.Props;
