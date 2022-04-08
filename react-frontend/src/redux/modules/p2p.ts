/**
 * @fileoverview Defines Peer-to-Peer state.
 * @copyright Shingo OKAWA 2022
 */
import * as RTCUtils from '../../utils/webrtc';
import * as WSUtils from '../../utils/websocket';
import * as FSA from 'typescript-fsa';
import actionCreatorFactory from 'typescript-fsa';

/** Action suffix. */
const SUFFIX = 'p2p';

/** Action type for OPEN. */
const OPEN = 'open';

/** Action type for CLOSE. */
const CLOSE = 'close';

/** Action type for NEW_DEVICES. */
const NEW_DEVICES = 'newDevices';

/** Action type for REMOVE_DEVICE. */
const REMOVE_DEVICE = 'removeDevice';

/** FSA action factory. */
const ACTION_CREATER = actionCreatorFactory(SUFFIX);

/** OPEN action creator. */
export const OPEN_ACTION = ACTION_CREATER<string>(OPEN);

/** CLOSE action creator. */
export const CLOSE_ACTION = ACTION_CREATER<void>(CLOSE);

/** NEW_DEVICES action creator. */
export const NEW_DEVICES_ACTION = ACTION_CREATER<
  WSUtils.ClientDescription | WSUtils.ClientDescription[]
>(NEW_DEVICES);

/** REMOVE_DEVICE action creator. */
export const REMOVE_DEVICE_ACTION = ACTION_CREATER<string>(REMOVE_DEVICE);

/** Returns true if the action is p2p. */
export const hasAction = (action: FSA.Action<unknown>): boolean =>
  OPEN_ACTION.match(action) ||
  CLOSE_ACTION.match(action) ||
  NEW_DEVICES_ACTION.match(action) ||
  REMOVE_DEVICE_ACTION.match(action);

/** OPEN action. */
export const open = (id: string): FSA.Action<string> => OPEN_ACTION(id);

/** CLOSE action. */
export const close = (): FSA.Action<void> => CLOSE_ACTION();

/** NEW_DEVICES action. */
export const newDevices = (
  devices: WSUtils.ClientDescription | WSUtils.ClientDescription[]
): FSA.Action<WSUtils.ClientDescription | WSUtils.ClientDescription[]> =>
  NEW_DEVICES_ACTION(devices);

/** REMOVE_DEVICE action. */
export const removeDevice = (id: string): FSA.Action<string> =>
  REMOVE_DEVICE_ACTION(id);

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
  id?: string;
  conn?: RTCPeerConnection;
  status?: Status;
  stream?: MediaStream;
  devices?: WSUtils.ClientDescription[];
};

/** An initial state of the module. */
const INITIAL_STATE = {
  id: '',
  conn: null,
  status: undefined,
  devices: [],
} as State;

/** A reducer of the module. */
const reducer = (
  state: State = INITIAL_STATE,
  action: FSA.Action<unknown>
): State => {
  if (FSA.isType(action, OPEN_ACTION)) {
    const conn = RTCUtils.create();
    return {
      ...state,
      id: action.payload,
      conn: conn,
      status: conn.connectionState,
      devices: [],
    } as State;
  }
  if (FSA.isType(action, CLOSE_ACTION)) {
    if (state.conn) state.conn.close();
    return {
      ...state,
      id: '',
      conn: null,
      status: undefined,
      devices: [],
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
  return state;
};

export default reducer;
