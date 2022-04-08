/**
 * @fileoverview Defines Signaling middleware.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import * as Events from 'events';
import * as FSA from 'typescript-fsa';
import * as Store from '../store';
import * as Console from '../../utils/console';
import * as WSUtils from '../../utils/websocket';
import * as Signaling from '../modules/signaling';
import * as Notification from '../modules/notification';

/** Exports singleton manager. */
let SHARED: WebSocket = null;

/** Signaling middleware. */
export const middleware: Redux.Middleware =
  <S extends Store.Type>({
    dispatch,
    getState,
  }: Redux.MiddlewareAPI<Redux.Dispatch, S>) =>
  (next: Redux.Dispatch<Redux.AnyAction>) =>
  (action: FSA.Action<unknown>): unknown => {
    /** @const Holds `true` if the signaling server is connected. */
    const isConnectionEstablished =
      SHARED &&
      getState().signaling.connection === Signaling.Connection.CONNECTED;

    if (Signaling.DISCONNECT_ACTION.match(action)) {
      if (SHARED) SHARED.close(1000);
    } else if (Signaling.CONNECT_ACTION.match(action)) {
      Console.info('opened connection to signaling server.');
      SHARED = new WebSocket(
        `ws://${action.payload.url}/connect?id=${action.payload.id}`
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      SHARED.onopen = (e: Event): void => {
        dispatch(
          Notification.success({
            title: 'SUCCESS (Signaling Server)',
            message: 'Connected to the signaling server',
            showCloseButton: true,
          })
        );
        dispatch(Signaling.established());
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      SHARED.onclose = (e: CloseEvent): void => {
        const reason = WSUtils.reasonOf(e);
        switch (reason.level) {
          case WSUtils.CloseLevel.SUCCESS:
            dispatch(
              Notification.success({
                title: `${reason.level} (Signaling Server)`,
                message: reason.message,
                showCloseButton: true,
              })
            );
            break;
          case WSUtils.CloseLevel.WARNING:
            dispatch(
              Notification.warning({
                title: `${reason.level} (Signaling Server)`,
                message: reason.message,
                showCloseButton: true,
              })
            );
            break;
          case WSUtils.CloseLevel.ERROR:
            dispatch(
              Notification.error({
                title: `${reason.level} (Signaling Server)`,
                message: reason.message,
                showCloseButton: true,
              })
            );
            break;
          default:
            dispatch(
              Notification.info({
                title: `${reason.level} (Signaling Server)`,
                message: reason.message,
                showCloseButton: true,
              })
            );
            break;
        }
        dispatch(Signaling.disconnect());
      };

      SHARED.onerror = (e: Event): void => {
        Console.error(`signaling: error occured ${e}`);
      };
    }

    return next(action);
  };
