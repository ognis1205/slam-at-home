/**
 * @fileoverview Defines Signaling middleware.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import * as FSA from 'typescript-fsa';
import * as Store from '../store';
import * as Console from '../../utils/console';
import * as SafeJSON from '../../utils/json';
import * as RTCUtils from '../../utils/webrtc';
import * as WSUtils from '../../utils/websocket';
import * as Signaling from '../modules/signaling';
import * as Notification from '../modules/notification';
import * as P2P from '../modules/p2p';

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
      SHARED && getState().signaling.status === Signaling.Status.CONNECTED;

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
        dispatch(P2P.close());
      };

      SHARED.onmessage = (e: MessageEvent): void => {
        new Response(e.data).text().then((message: string) => {
          const signal = SafeJSON.safeParse(WSUtils.isSignal)(message);
          if (signal.hasError) {
            Console.warning(`signaling: recieved malformed signal from server`);
            dispatch(
              Notification.warning({
                title: 'WARNING (Signaling Server)',
                message: 'Recieved malformed signal from server',
                showCloseButton: true,
              })
            );
          } else {
            if (signal.json.type === WSUtils.SignalType.ICE_CANDIDATE) {
              console.log('ice candiate', signal);
              //if (signal.to === user) processIce(signal.payload);
            } else if (
              signal.json.type === WSUtils.SignalType.SESSION_DESCRIPTION
            ) {
              // incoming offer
              console.log('session description', signal);
              //if (signal.payload.type === 'offer' && signal.to === user) {
              //  user2 = signal.from;
              //  processOffer(signal.payload);
              //}
              // incoming answer
              //if (signal.payload.type === 'answer' && signal.to === user) {
              //  processAnswer(signal.payload);
              //}
            } else if (signal.json.type === WSUtils.SignalType.NEW_CONNECTION) {
              Console.info('New device found on the network');
              dispatch(
                P2P.newDevices({
                  id: signal.json.from,
                  name: signal.json.payload,
                })
              );
              dispatch(
                Notification.info({
                  title: 'INFO (Signaling Server)',
                  message: 'New device found on the network',
                  showCloseButton: true,
                })
              );
            } else if (signal.json.type === WSUtils.SignalType.DISCONNECTION) {
              Console.warning('A device disconnected from the network');
              const currentId = getState().p2p.id;
              if (currentId && currentId === signal.json.from)
                dispatch(P2P.close(signal.json.from));
              dispatch(P2P.removeDevice(signal.json.from));
              dispatch(
                Notification.warning({
                  title: 'WARNING (Signaling Server)',
                  message: 'A device disconnected from the network',
                  showCloseButton: true,
                })
              );
            } else if (
              signal.json.type === WSUtils.SignalType.LIST_REMOTE_PEERS
            ) {
              Console.info('Acquired the information of connected devices');
              dispatch(P2P.newDevices(signal.json.payload));
              dispatch(
                Notification.info({
                  title: 'INFO (Signaling Server)',
                  message: 'Acquired the information of connected devices',
                  showCloseButton: true,
                })
              );
            }
          }
        });
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      SHARED.onerror = (e: Event): void => {
        Console.error(`signaling: error occured`);
      };
    }

    return next(action);
  };
