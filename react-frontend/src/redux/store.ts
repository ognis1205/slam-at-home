/**
 * @fileoverview Defines Redux store creater.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import * as NextRedux from 'next-redux-wrapper';
import * as Notification from './middlewares/notification';
import * as Signaling from './middlewares/signaling';
import * as NotificationReducks from './modules/notification';
import * as SignalingReducks from './modules/signaling';
import reducer from './modules/reducer';

/** Redux middlewares. */
const enhancer = Redux.applyMiddleware(
  Notification.middleware,
  Signaling.middleware
);

/** A {Store} type. */
export type Type = {
  notification: NotificationReducks.State;
  signaling: SignalingReducks.State;
};

/** Redux Next.js wrapper. */
export const wrapper = NextRedux.createWrapper<Redux.Store>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_: NextRedux.Context) => Redux.createStore(reducer, enhancer),
  { debug: true }
);
