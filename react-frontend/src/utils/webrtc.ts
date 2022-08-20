/**
 * @fileoverview Defines WebRTC helper classes and functions.
 * @copyright Shingo OKAWA 2022
 */
import * as WebSocketUtil from './websocket';

/** A type union of description types.  */
export const RTCSessionDescriptionType = {
  ANSWER: 'answer',
  OFFER: 'offer',
  PRANSWER: 'pranswer',
  ROLLBACK: 'rollback',
} as const;

export type RTCSessionDescriptionType =
  typeof RTCSessionDescriptionType[keyof typeof RTCSessionDescriptionType];

/** Represents WebRTC client. */
export class Client {
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
