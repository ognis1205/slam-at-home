/**
 * @fileoverview Defines WebRTC middleware.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import * as FSA from 'typescript-fsa';
import * as Store from '../store';
import * as Console from '../../utils/console';
import * as SafeJSON from '../../utils/json';
import * as WebSocketUtil from '../../utils/websocket';
import * as WebRTCUtil from '../../utils/webrtc';
import * as Signaling from '../modules/signaling';
import * as Notification from '../modules/notification';
import * as RTC from '../modules/rtc';

/** Singleton manager. */
const CLIENT = new WebRTCUtil.Client();

/** Called on `RTC.OFFER_ACTION`. */
const onWebRTCOfferAction = (
  remoteId: string,
  dispatch: Redux.Dispatch
): ReturnType<typeof CLIENT.offer> =>
  CLIENT.offer(
    (sdp: RTCSessionDescriptionInit) => {
      dispatch(RTC.newLocalSDP());
      dispatch(Signaling.offer(remoteId, sdp));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e: Error) => {
      dispatch(
        Notification.error({
          title: 'ERROR (Peer Connection)',
          message: 'Failed to set the local SDP to send offer',
          showCloseButton: true,
        })
      );
    }
  );

/** Called on `Signaling.DISCONNECT_ACTION`. */
const onSignalingDisconnectAction = (): ReturnType<typeof CLIENT.closeSocket> =>
  CLIENT.closeSocket();

/** Called on `Signaling.OFFER_ACTION`. */
const onSignalingOfferAction = <S extends Store.Type>(
  remoteId: string,
  sdp: RTCSessionDescriptionInit,
  dispatch: Redux.Dispatch,
  getState: () => S
): void => {
  const offerIsReady =
    CLIENT.isReady() &&
    getState()?.signaling?.status === Signaling.Status.CONNECTED &&
    getState()?.signaling?.localId;

  if (!offerIsReady) {
    dispatch(
      Notification.error({
        title: 'ERROR (Peer Connection)',
        message: 'Error occured while sending WebRTC offer to remote',
        showCloseButton: true,
      })
    );
    return;
  }

  if (CLIENT.conn.connectionState !== RTC.Status.NEW) {
    CLIENT.closeConnection();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    CLIENT.openConnection((e: Event): void => {
      dispatch(RTC.newStatus(CLIENT.conn.connectionState));
    });
  }

  CLIENT.conn.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
    if (!e || !e.candidate) return;
    dispatch(RTC.newLocalCandidate());
    CLIENT.send<RTCIceCandidate>(
      getState()?.signaling?.localId,
      remoteId,
      WebSocketUtil.SignalType.ICE_CANDIDATE,
      e.candidate
    );
  };

  CLIENT.send<RTCSessionDescriptionInit>(
    getState()?.signaling?.localId,
    remoteId,
    WebSocketUtil.SignalType.SESSION_DESCRIPTION,
    sdp
  );

  Console.info(`WebRTC: Sent WebRTC offer to remote`);
};

const newSocketOpenHandler =
  (dispatch: Redux.Dispatch) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (e: Event): void => {
    dispatch(
      Notification.success({
        title: 'SUCCESS (Signaling Server)',
        message: 'Connected to signaling server',
        showCloseButton: true,
      })
    );
    dispatch(Signaling.established());
    dispatch(RTC.open());
  };

const newSocketCloseHandler =
  (dispatch: Redux.Dispatch) =>
  (e: CloseEvent): void => {
    const reason = WebSocketUtil.reasonOf(e);
    switch (reason.level) {
      case WebSocketUtil.CloseLevel.SUCCESS:
        dispatch(
          Notification.success({
            title: `${reason.level} (Signaling Server)`,
            message: reason.message,
            showCloseButton: true,
          })
        );
        break;
      case WebSocketUtil.CloseLevel.WARNING:
        dispatch(
          Notification.warning({
            title: `${reason.level} (Signaling Server)`,
            message: reason.message,
            showCloseButton: true,
          })
        );
        break;
      case WebSocketUtil.CloseLevel.ERROR:
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
    dispatch(RTC.close());
  };

const newRTCErrorHandler =
  (dispatch: Redux.Dispatch) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (e: Error): void => {
    dispatch(
      Notification.error({
        title: 'ERROR (Peer Connection)',
        message: 'Failed to establish WebRTC peer connection',
        showCloseButton: true,
      })
    );
  };

const newRTCSetLocalSDPHandler =
  (dispatch: Redux.Dispatch) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (sdp: RTCSessionDescriptionInit): void => {
    dispatch(RTC.newLocalSDP());
    Console.info(`WebRTC: Set local SDP`);
  };

const newRTCSetRemoteSDPHandler =
  (dispatch: Redux.Dispatch) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (sdp: RTCSessionDescriptionInit): void => {
    dispatch(RTC.newRemoteSDP());
    Console.info(`WebRTC: Set remote SDP`);
  };

const newRTCAddRemoteCandidateHandler =
  (dispatch: Redux.Dispatch) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (ice: RTCIceCandidate): void => {
    dispatch(RTC.newRemoteCandidate());
    Console.info(`WebRTC: Add remote candidate`);
  };

const newRTCNewStreamHandler =
  (dispatch: Redux.Dispatch) =>
  (stream: MediaStream): void => {
    dispatch(RTC.newStream(stream));
    dispatch(
      Notification.info({
        title: 'INFO (Peer Connection)',
        message: 'Created media stream for WebRTC peer connection',
        showCloseButton: true,
      })
    );
  };

const newSocketMessageHandler =
  <S extends Store.Type>(dispatch: Redux.Dispatch, getState: () => S) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (e: MessageEvent): Promise<void> =>
    new Response(e.data).text().then((message: string) => {
      const signal = SafeJSON.safeParse(WebSocketUtil.isSignal)(message);

      if (signal.hasError) {
        dispatch(
          Notification.warning({
            title: 'WARNING (Signaling Server)',
            message: 'Recieved malformed signal from server',
            showCloseButton: true,
          })
        );
        return;
      }

      switch (signal.json.type) {
        case WebSocketUtil.SignalType.ICE_CANDIDATE:
          CLIENT.onIce(
            signal.json.payload as RTCIceCandidate,
            newRTCAddRemoteCandidateHandler(dispatch),
            newRTCErrorHandler(dispatch)
          );
          break;
        case WebSocketUtil.SignalType.SESSION_DESCRIPTION:
          if (
            (signal.json.payload as RTCSessionDescriptionInit).type ===
            WebRTCUtil.RTCSessionDescriptionType.OFFER
          )
            CLIENT.onOffer(
              signal.json.payload as RTCSessionDescriptionInit,
              newRTCSetLocalSDPHandler(dispatch),
              newRTCErrorHandler(dispatch)
            );
          if (
            (signal.json.payload as RTCSessionDescriptionInit).type ===
            WebRTCUtil.RTCSessionDescriptionType.ANSWER
          )
            CLIENT.onAnswer(
              signal.json.payload as RTCSessionDescriptionInit,
              newRTCSetRemoteSDPHandler(dispatch),
              newRTCNewStreamHandler(dispatch),
              newRTCErrorHandler(dispatch)
            );
          break;
        case WebSocketUtil.SignalType.NEW_CONNECTION:
          dispatch(
            RTC.newDevices({
              id: signal.json.from,
              name: signal.json.payload as string,
            })
          );
          dispatch(
            Notification.info({
              title: 'INFO (Signaling Server)',
              message: 'New device found on network',
              showCloseButton: true,
            })
          );
          break;
        case WebSocketUtil.SignalType.DISCONNECTION:
          if (
            getState()?.signaling?.remoteId &&
            getState()?.signaling?.remoteId === signal.json.from
          ) {
            dispatch(Signaling.disconnect());
          } else {
            dispatch(RTC.removeDevice(signal.json.from));
            dispatch(
              Notification.warning({
                title: 'WARNING (Signaling Server)',
                message: 'Device disconnected from network',
                showCloseButton: true,
              })
            );
          }
          break;
        case WebSocketUtil.SignalType.LIST_REMOTE_PEERS:
          dispatch(
            RTC.newDevices(
              signal.json.payload as
                | WebSocketUtil.ClientDescription
                | WebSocketUtil.ClientDescription[]
            )
          );
          break;
        default:
          break;
      }
    });

const newSocketErrorHandler =
  () =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (e: Event): void => {
    Console.error(`WebRTC: Error occured`);
  };

/** Called on `Signaling.CONNECT_ACTION`. */
const onSignalingConnectAction = <S extends Store.Type>(
  url: string,
  localId: string,
  dispatch: Redux.Dispatch,
  getState: () => S
): void => {
  CLIENT.openSocket(
    url,
    localId,
    newSocketOpenHandler(dispatch),
    newSocketCloseHandler(dispatch),
    newSocketMessageHandler(dispatch, getState),
    newSocketErrorHandler()
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CLIENT.openConnection((e: Event): void => {
    dispatch(RTC.newStatus(CLIENT.conn.connectionState));
  });
};

/** Signaling middleware. */
export const middleware: Redux.Middleware =
  <S extends Store.Type>({
    dispatch,
    getState,
  }: Redux.MiddlewareAPI<Redux.Dispatch, S>) =>
  (next: Redux.Dispatch<Redux.AnyAction>) =>
  (action: FSA.Action<unknown>): unknown => {
    if (RTC.OFFER_ACTION.match(action))
      onWebRTCOfferAction(action.payload, dispatch);

    if (Signaling.DISCONNECT_ACTION.match(action))
      onSignalingDisconnectAction();

    if (Signaling.OFFER_ACTION.match(action))
      onSignalingOfferAction(
        action.payload.remoteId,
        action.payload.sdp,
        dispatch,
        getState
      );

    if (Signaling.CONNECT_ACTION.match(action))
      onSignalingConnectAction(
        action.payload.url,
        action.payload.localId,
        dispatch,
        getState
      );

    return next(action);
  };
