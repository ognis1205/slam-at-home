/**
 * @fileoverview Defines Real Time Communication state.
 * @copyright Shingo OKAWA 2022
 */
import * as WSUtils from '../../utils/websocket';
import * as FSA from 'typescript-fsa';
import actionCreatorFactory from 'typescript-fsa';

/** Action suffix. */
const SUFFIX = 'rtc';

/** Action type for OPEN. */
const OPEN = 'open';

/** Action type for CLOSE. */
const CLOSE = 'close';

/** Action type for OFFER. */
const OFFER = 'offer';

/** Action type for NEW_REMOTE. */
//const NEW_REMOTE = 'newRemote';

/** Action type for NEW_DEVICES. */
const NEW_DEVICES = 'newDevices';

/** Action type for REMOVE_DEVICE. */
const REMOVE_DEVICE = 'removeDevice';

/** Action type for NEW_STATUS. */
const NEW_STATUS = 'newStatus';

/** Action type for NEW_STREAM. */
const NEW_STREAM = 'newStream';

/** Action type for NEW_LOCAL_SDP. */
const NEW_LOCAL_SDP = 'newLocalSDP';

/** Action type for NEW_REMOTE_SDP. */
const NEW_REMOTE_SDP = 'newRemoteSDP';

/** Action type for NEW_LOCAL_CANDIDATE. */
const NEW_LOCAL_CANDIDATE = 'newLocalCandidate';

/** Action type for NEW_REMOTE_CANDIDATE. */
const NEW_REMOTE_CANDIDATE = 'newRemoteCandidate';

/** FSA action factory. */
const ACTION_CREATER = actionCreatorFactory(SUFFIX);

/** OPEN action creator. */
export const OPEN_ACTION = ACTION_CREATER<void>(OPEN);

/** CLOSE action creator. */
export const CLOSE_ACTION = ACTION_CREATER<void>(CLOSE);

/** OFFER action creator. */
export const OFFER_ACTION = ACTION_CREATER<string>(OFFER);

/** NEW_REMOTE action creator. */
//export const NEW_REMOTE_ACTION = ACTION_CREATER<string>(NEW_REMOTE);

/** NEW_DEVICES action creator. */
export const NEW_DEVICES_ACTION = ACTION_CREATER<
  WSUtils.ClientDescription | WSUtils.ClientDescription[]
>(NEW_DEVICES);

/** REMOVE_DEVICE action creator. */
export const REMOVE_DEVICE_ACTION = ACTION_CREATER<string>(REMOVE_DEVICE);

/** NEW_STATUS action creator. */
export const NEW_STATUS_ACTION = ACTION_CREATER<Status>(NEW_STATUS);

/** NEW_STREAM action creator. */
export const NEW_STREAM_ACTION = ACTION_CREATER<MediaStream>(NEW_STREAM);

/** NEW_LOCAL_SDP action creator. */
export const NEW_LOCAL_SDP_ACTION = ACTION_CREATER<void>(NEW_LOCAL_SDP);

/** NEW_REOTE_SDP action creator. */
export const NEW_REMOTE_SDP_ACTION = ACTION_CREATER<void>(NEW_REMOTE_SDP);

/** NEW_LOCAL_CANDIDATE action creator. */
export const NEW_LOCAL_CANDIDATE_ACTION =
  ACTION_CREATER<void>(NEW_LOCAL_CANDIDATE);

/** NEW_REOTE_CANDIDATE action creator. */
export const NEW_REMOTE_CANDIDATE_ACTION =
  ACTION_CREATER<void>(NEW_REMOTE_CANDIDATE);

/** Returns true if the action is rtc. */
export const hasAction = (action: FSA.Action<unknown>): boolean =>
  OPEN_ACTION.match(action) ||
  CLOSE_ACTION.match(action) ||
  OFFER_ACTION.match(action) ||
  NEW_DEVICES_ACTION.match(action) ||
  REMOVE_DEVICE_ACTION.match(action) ||
  NEW_STATUS_ACTION.match(action) ||
  NEW_STREAM_ACTION.match(action) ||
  NEW_LOCAL_SDP_ACTION.match(action) ||
  NEW_REMOTE_SDP_ACTION.match(action) ||
  NEW_LOCAL_CANDIDATE_ACTION.match(action) ||
  NEW_REMOTE_CANDIDATE_ACTION.match(action);

/** OPEN action. */
export const open = (): FSA.Action<void> => OPEN_ACTION();

/** CLOSE action. */
export const close = (): FSA.Action<void> => CLOSE_ACTION();

/** OFFER action. */
export const offer = (remoteId: string): FSA.Action<string> =>
  OFFER_ACTION(remoteId);

/** NEW_DEVICES action. */
export const newDevices = (
  devices: WSUtils.ClientDescription | WSUtils.ClientDescription[]
): FSA.Action<WSUtils.ClientDescription | WSUtils.ClientDescription[]> =>
  NEW_DEVICES_ACTION(devices);

/** REMOVE_DEVICE action. */
export const removeDevice = (id: string): FSA.Action<string> =>
  REMOVE_DEVICE_ACTION(id);

/** NEW_STATUS action. */
export const newStatus = (status: Status): FSA.Action<Status> =>
  NEW_STATUS_ACTION(status);

/** NEW_STREAM action. */
export const newStream = (stream: MediaStream): FSA.Action<MediaStream> =>
  NEW_STREAM_ACTION(stream);

/** NEW_LOCAL_SDP action. */
export const newLocalSDP = (): FSA.Action<void> => NEW_LOCAL_SDP_ACTION();

/** NEW_REMOTE_SDP action. */
export const newRemoteSDP = (): FSA.Action<void> => NEW_REMOTE_SDP_ACTION();

/** NEW_LOCAL_CANDIDATE action. */
export const newLocalCandidate = (): FSA.Action<void> =>
  NEW_LOCAL_CANDIDATE_ACTION();

/** NEW_REMOTE_CANDIDATE action. */
export const newRemoteCandidate = (): FSA.Action<void> =>
  NEW_REMOTE_CANDIDATE_ACTION();

/** A type union of connection states. */
export const Status = {
  NEW: 'new',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  FAILED: 'failed',
  CLOSED: 'closed',
} as const;

export type Status = typeof Status[keyof typeof Status];

/** A {State} type. */
export type State = {
//  id?: string;
//  remoteId?: string;
//  conn?: RTCPeerConnection;
  status?: Status;
  stream?: MediaStream;
  devices?: WSUtils.ClientDescription[];
  hasLocalSDP: boolean;
  hasRemoteSDP: boolean;
  localCandidate: number;
  remoteCandidate: number;
};

/** An initial state of the module. */
const INITIAL_STATE = {
//  id: '',
//  remoteId: '',
//  conn: null,
  status: undefined,
  stream: undefined,
  devices: [],
  hasLocalSDP: false,
  hasRemoteSDP: false,
  localCandidate: 0,
  remoteCandidate: 0,
} as State;

/** A reducer of the module. */
const reducer = (
  state: State = INITIAL_STATE,
  action: FSA.Action<unknown>
): State => {
  if (FSA.isType(action, OPEN_ACTION)) {
    return {
      ...state,
//      id: action.payload.id,
//      remoteId: '',
//      conn: action.payload.conn,
      status: Status.NEW,
      stream: undefined,
      devices: [],
      hasLocalSDP: false,
      hasRemoteSDP: false,
      localCandidate: 0,
      remoteCandidate: 0,
    } as State;
  }
  if (FSA.isType(action, CLOSE_ACTION)) {
//    if (state.conn) state.conn.close();
    return {
      ...state,
//      id: '',
//      remoteId: '',
//      conn: null,
      status: undefined,
      stream: undefined,
      devices: [],
      hasLocalSDP: false,
      hasRemoteSDP: false,
      localCandidate: 0,
      remoteCandidate: 0,
    } as State;
  }
  if (FSA.isType(action, OFFER_ACTION)) {
    return {
      ...state,
    } as State;
  }
  if (FSA.isType(action, NEW_DEVICES_ACTION)) {
    return {
      ...state,
      devices: [
        ...state.devices,
        ...(Array.isArray(action.payload) ? action.payload : [action.payload]),
      ],
    } as State;
  }
  if (FSA.isType(action, REMOVE_DEVICE_ACTION)) {
    return {
      ...state,
      devices: state.devices.filter((d) => action.payload !== d.id),
    } as State;
  }
  if (FSA.isType(action, NEW_STATUS_ACTION)) {
    return {
      ...state,
      status: action.payload,
    } as State;
  }
  if (FSA.isType(action, NEW_STREAM_ACTION)) {
    return {
      ...state,
      stream: action.payload,
    } as State;
  }
  if (FSA.isType(action, NEW_LOCAL_SDP_ACTION)) {
    return {
      ...state,
      hasLocalSDP: true,
    } as State;
  }
  if (FSA.isType(action, NEW_REMOTE_SDP_ACTION)) {
    return {
      ...state,
      hasRemoteSDP: true,
    } as State;
  }
  if (FSA.isType(action, NEW_LOCAL_CANDIDATE_ACTION)) {
    return {
      ...state,
      localCandidate: state.localCandidate + 1,
    } as State;
  }
  if (FSA.isType(action, NEW_REMOTE_CANDIDATE_ACTION)) {
    return {
      ...state,
      remoteCandidate: state.remoteCandidate + 1,
    } as State;
  }
  return state;
};

export default reducer;
