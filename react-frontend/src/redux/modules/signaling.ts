/**
 * @fileoverview Defines Signaling state.
 * @copyright Shingo OKAWA 2022
 */
import * as FSA from 'typescript-fsa';
import actionCreatorFactory from 'typescript-fsa';

/** Action suffix. */
const SUFFIX = 'signaling';

/** Action type for CONNECT. */
const CONNECT = 'connect';

/** Action type for ESTABLISHED. */
const ESTABLISHED = 'established';

/** Action type for DISCONNECT. */
const DISCONNECT = 'disconnect';

/** FSA action factory. */
const ACTION_CREATER = actionCreatorFactory(SUFFIX);

/** CONNECT action creator. */
export const CONNECT_ACTION =
  ACTION_CREATER<{ url: string; id: string }>(CONNECT);

/** ESTABLISHED action creator. */
export const ESTABLISHED_ACTION = ACTION_CREATER<void>(ESTABLISHED);

/** DISCONNECT action creator. */
export const DISCONNECT_ACTION = ACTION_CREATER<void>(DISCONNECT);

/** Returns true if the action is signaling. */
export const hasAction = (action: FSA.Action<unknown>): boolean =>
  CONNECT_ACTION.match(action) ||
  ESTABLISHED_ACTION.match(action) ||
  DISCONNECT_ACTION.match(action);

/** CONNECT action. */
export const connect = (
  url: string,
  id: string
): FSA.Action<{ url: string; id: string }> =>
  CONNECT_ACTION({ url: url, id: id });

/** ESTABLISED action. */
export const established = (): FSA.Action<void> => ESTABLISHED_ACTION();

/** DISCONNECT action. */
export const disconnect = (): FSA.Action<void> => DISCONNECT_ACTION();

/** A type union of connection states. */
export const Status = {
  DISCONNECTED: 'disconnected',
  ESTABLISHING: 'establishing',
  CONNECTED: 'connected',
} as const;

export type Status = typeof Status[keyof typeof Status];

/** A {State} type. */
export type State = {
  status: Status;
  id?: string;
  url?: string;
};

/** An initial state of the module. */
const INITIAL_STATE = {
  status: Status.DISCONNECTED,
  id: '',
  url: '',
} as State;

/** A reducer of the module. */
const reducer = (
  state: State = INITIAL_STATE,
  action: FSA.Action<unknown>
): State => {
  if (FSA.isType(action, CONNECT_ACTION))
    return {
      ...state,
      status: Status.ESTABLISHING,
      id: action.payload.id,
      url: action.payload.url,
    } as State;
  if (FSA.isType(action, ESTABLISHED_ACTION))
    return {
      ...state,
      status: Status.CONNECTED,
    } as State;
  if (FSA.isType(action, DISCONNECT_ACTION))
    return {
      ...state,
      status: Status.DISCONNECTED,
      id: undefined,
      url: undefined,
    } as State;
  return state;
};

export default reducer;
