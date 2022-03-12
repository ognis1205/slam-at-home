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

/** Sets transition property. */
const setTransitionProperty: Motion.DoneEventHandler = (_, event) =>
  (event as TransitionEvent).propertyName === 'transform';

/** Motion for notification collapse. */
export default {
  name: 'notification',
  onAppearStart: hideX,
  onAppearActive: showX,
  onAppearDone: setTransitionProperty,
  onExitStart: showX,
  onExitActive: hideX,
  onExitDone: setTransitionProperty,
  deadline: 500,
} as Motion.Props;
