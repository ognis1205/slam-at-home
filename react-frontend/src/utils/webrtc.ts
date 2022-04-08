/**
 * @fileoverview Defines WebRTC helper functions.
 * @copyright Shingo OKAWA 2022
 */

/** WebRTC connection configuration. */
const CONFIG = {
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
const CONSTRAINTS = {
  offerToReceiveAudio: false,
  offerToReceiveVideo: true,
};

/** Creates a RTCPeerConnection. */
export const create = (): RTCPeerConnection => new RTCPeerConnection(CONFIG);

/** Creates an offer to the remote. */
export const offer = (
  conn: RTCPeerConnection,
  onSetLocalDescription: (sdp: RTCSessionDescriptionInit) => void,
  onError: (e: Error) => void
): Promise<void> =>
  conn
    .createOffer(CONSTRAINTS)
    .then((sdp: RTCSessionDescriptionInit) => {
      conn.setLocalDescription(sdp).then(() => {
        onSetLocalDescription(sdp);
      });
    })
    .catch((e: Error) => {
      onError(e);
    });

/** Called when a remote offer arrives. */
export const onOffer = (
  conn: RTCPeerConnection,
  sdp: RTCSessionDescriptionInit,
  onSetLocalDescription: (sdp: RTCSessionDescriptionInit) => void,
  onError: (e: Error) => void
): Promise<void> =>
  conn
    .setRemoteDescription(sdp)
    .then(() => {
      conn.createAnswer(CONSTRAINTS).then((sdp: RTCSessionDescriptionInit) => {
        conn.setLocalDescription(sdp).then(() => {
          onSetLocalDescription(sdp);
        });
      });
    })
    .catch((e: Error) => {
      onError(e);
    });

/** Called when a remote answer arrives. */
export const onAnswer = (
  conn: RTCPeerConnection,
  sdp: RTCSessionDescriptionInit,
  onNewStream: (stream: MediaStream) => void,
  onError: (e: Error) => void
): Promise<void> =>
  conn
    .setRemoteDescription(sdp)
    .then(() => {
      const recievers = conn.getReceivers();
      if (recievers.length < 1) throw Error('could not get recievers');
      const reciever = recievers[0];
      const stream = new MediaStream();
      stream.addTrack(reciever.track);
      onNewStream(stream);
    })
    .catch((e: Error) => {
      onError(e);
    });
