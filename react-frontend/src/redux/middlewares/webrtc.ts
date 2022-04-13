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
import * as Signaling from '../modules/signaling';
import * as Notification from '../modules/notification';
import * as RTC from '../modules/rtc';

/** A type union of description types.  */
const RTCSessionDescriptionType = {
  ANSWER: 'answer',
  OFFER: 'offer',
  PRANSWER: 'pranswer',
  ROLLBACK: 'rollback',
} as const;

type RTCSessionDescriptionType =
  typeof RTCSessionDescriptionType[keyof typeof RTCSessionDescriptionType];

/** Represents WebRTC client. */
class Client {
  /** WebRTC connection configuration. */
  private static readonly CONFIG = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  };

  /** WebRTC options requested for the offer. */
  private static readonly CONSTRAINTS = {
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  };

  /** Holds a websocket for signaling. */
  public sock: WebSocket;

  /** Holds a peer connection for peer communication. */
  public conn: RTCPeerConnection;

  /** Opens a new signaling socket. */
  public openSocket(
    url: string,
    id: string,
    onOpen: (e: Event) => void,
    onClose: (e: CloseEvent) => void,
    onMessage: (e: MessageEvent) => Promise<void>,
    onError: (e: Event) => void
  ): void {
    if (this.sock) this.sock.close(1000);
    this.sock = new WebSocket(`ws://${url}/connect?id=${id}`);

    this.sock.onopen = (e: Event): void => {
      if (onOpen) onOpen(e);
    };

    this.sock.onclose = (e: CloseEvent): void => {
      if (onClose) onClose(e);
    };

    this.sock.onmessage = (e: MessageEvent): void => {
      if (onMessage) onMessage(e);
    };

    this.sock.onerror = (e: Event): void => {
      if (onError) onError(e);
    };
  }

  /** Closes a signaling socket. */
  public closeSocket(): void {
    if (this.sock) this.sock.close(1000);
  }

  /** Opens a new peer connection. */
  public openConnection(onConnectionStateChange: (e: Event) => void): void {
    if (this.conn) this.conn.close();
    this.conn = new RTCPeerConnection(Client.CONFIG);
    this.conn.onconnectionstatechange = onConnectionStateChange;
  }

  /** Closes a peer connection. */
  public closeConnection(): void {
    if (this.conn) this.conn.close();
    this.conn.onconnectionstatechange = null;
    this.conn = null;
  }

  /** Returns `true` if the client is ready to establish peer connection. */
  public isReady(): boolean {
    return !!this.sock && !!this.conn;
  }

  /** Sends a given message via WebSocket. */
  public send<T>(
    from: string,
    to: string,
    type: WebSocketUtil.SignalType,
    message: T
  ): void {
    if (this.sock)
      this.sock.send(
        JSON.stringify({
          from: from,
          to: to,
          type: type,
          payload: message,
        })
      );
  }

  /** Creates an offer to the remote peer. */
  public offer(
    onSetLocalDescription: (sdp: RTCSessionDescriptionInit) => void,
    onError: (e: Error) => void
  ): Promise<void> {
    if (this.conn) {
      this.conn
        .createOffer(Client.CONSTRAINTS)
        .then((sdp: RTCSessionDescriptionInit) => {
          this.conn.setLocalDescription(sdp).then(() => {
            onSetLocalDescription(sdp);
          });
        })
        .catch((e: Error) => {
          onError(e);
        });
    }
    return;
  }

  /** Called when a remote offer arrives. */
  public onOffer(
    sdp: RTCSessionDescriptionInit,
    onSetLocalDescription: (sdp: RTCSessionDescriptionInit) => void,
    onError: (e: Error) => void
  ): Promise<void> {
    if (this.conn) {
      this.conn
        .setRemoteDescription(sdp)
        .then(() => {
          this.conn
            .createAnswer(Client.CONSTRAINTS)
            .then((sdp: RTCSessionDescriptionInit) => {
              this.conn.setLocalDescription(sdp).then(() => {
                onSetLocalDescription(sdp);
              });
            });
        })
        .catch((e: Error) => {
          onError(e);
        });
    }
    return;
  }

  /** Called when a remote answer arrives. */
  public onAnswer(
    sdp: RTCSessionDescriptionInit,
    onSetRemoteDescription: (sdp: RTCSessionDescriptionInit) => void,
    onNewStream: (stream: MediaStream) => void,
    onError: (e: Error) => void
  ): Promise<void> {
    if (this.conn) {
      this.conn
        .setRemoteDescription(sdp)
        .then(() => {
          onSetRemoteDescription(sdp);
          const recievers = this.conn.getReceivers();
          if (recievers.length < 1) throw Error('could not get recievers');
          const reciever = recievers[0];
          const stream = new MediaStream();
          stream.addTrack(reciever.track);
          onNewStream(stream);
        })
        .catch((e: Error) => {
          onError(e);
        });
    }
    return;
  }

  /** Called when an ice candidate arrives. */
  public onIce(
    ice: RTCIceCandidate,
    onAddRemoteCandidate: (ice: RTCIceCandidate) => void,
    onError: (e: Error) => void
  ): Promise<void> {
    if (this.conn) {
      this.conn
        .addIceCandidate(ice)
        .then(() => {
          onAddRemoteCandidate(ice);
        })
        .catch((e: Error) => {
          onError(e);
        });
    }
    return;
  }
}

/** Singleton manager. */
const CLIENT = new Client();

/** Signaling middleware. */
export const middleware: Redux.Middleware =
  <S extends Store.Type>({
    dispatch,
    getState,
  }: Redux.MiddlewareAPI<Redux.Dispatch, S>) =>
  (next: Redux.Dispatch<Redux.AnyAction>) =>
  (action: FSA.Action<unknown>): unknown => {
    if (RTC.OFFER_ACTION.match(action)) {
      CLIENT.offer(
        (sdp: RTCSessionDescriptionInit) => {
          dispatch(RTC.newLocalSDP());
          dispatch(Signaling.offer(action.payload, sdp));
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
    }

    if (Signaling.DISCONNECT_ACTION.match(action)) {
      CLIENT.closeSocket();
    }

    if (Signaling.OFFER_ACTION.match(action)) {
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
      } else {
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
            action.payload.remoteId,
            WebSocketUtil.SignalType.ICE_CANDIDATE,
            e.candidate
          );
        };
        CLIENT.send<RTCSessionDescriptionInit>(
          getState()?.signaling?.localId,
          action.payload.remoteId,
          WebSocketUtil.SignalType.SESSION_DESCRIPTION,
          action.payload.sdp
        );
        dispatch(
          Notification.info({
            title: 'INFO (Peer Connection)',
            message: 'Sent WebRTC offer to remote',
            showCloseButton: true,
          })
        );
      }
    }

    if (Signaling.CONNECT_ACTION.match(action)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleOpen = (e: Event): void => {
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

      const handleClose = (e: CloseEvent): void => {
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleError = (e: Error): void => {
        dispatch(
          Notification.error({
            title: 'ERROR (Peer Connection)',
            message: 'Failed to establish WebRTC peer connection',
            showCloseButton: true,
          })
        );
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleSetLocalSDP = (sdp: RTCSessionDescriptionInit): void => {
        dispatch(RTC.newLocalSDP());
        dispatch(
          Notification.info({
            title: 'INFO (Peer Connection)',
            message: 'Set local SDP',
            showCloseButton: true,
          })
        );
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleSetRemoteSDP = (sdp: RTCSessionDescriptionInit): void => {
        dispatch(RTC.newRemoteSDP());
        dispatch(
          Notification.info({
            title: 'INFO (Peer Connection)',
            message: 'Set remote SDP',
            showCloseButton: true,
          })
        );
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleAddRemoteCandidate = (ice: RTCIceCandidate): void => {
        dispatch(RTC.newRemoteCandidate());
      };

      const handleNewStream = (stream: MediaStream): void => {
        dispatch(RTC.newStream(stream));
        dispatch(
          Notification.info({
            title: 'INFO (Peer Connection)',
            message: 'Created media stream for WebRTC peer connection',
            showCloseButton: true,
          })
        );
      };

      const handleMessage = (e: MessageEvent): Promise<void> =>
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
                handleAddRemoteCandidate,
                handleError
              );
              break;
            case WebSocketUtil.SignalType.SESSION_DESCRIPTION:
              if (
                (signal.json.payload as RTCSessionDescriptionInit).type ===
                RTCSessionDescriptionType.OFFER
              )
                CLIENT.onOffer(
                  signal.json.payload as RTCSessionDescriptionInit,
                  handleSetLocalSDP,
                  handleError
                );
              if (
                (signal.json.payload as RTCSessionDescriptionInit).type ===
                RTCSessionDescriptionType.ANSWER
              )
                CLIENT.onAnswer(
                  signal.json.payload as RTCSessionDescriptionInit,
                  handleSetRemoteSDP,
                  handleNewStream,
                  handleError
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

      CLIENT.openSocket(
        action.payload.url,
        action.payload.localId,
        handleOpen,
        handleClose,
        handleMessage,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (e: Event): void => Console.error(`webrtc: error occured`)
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      CLIENT.openConnection((e: Event): void => {
        dispatch(RTC.newStatus(CLIENT.conn.connectionState));
      });
    }

    return next(action);
  };
