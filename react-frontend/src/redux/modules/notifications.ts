/**
 * @fileoverview Defines Notification state.
 * @copyright Shingo OKAWA 2022
 */
import * as FSA from 'typescript-fsa';
import actionCreatorFactory from 'typescript-fsa';

/** Action type for INFO. */
const INFO = 'info';

/** Action type for SUCCESS. */
const SUCCESS = 'success';

/** Action type for WARNING. */
const WARNING = 'warning';

/** Action type for ERROR. */
const ERROR = 'error';

/** Action type for CUSTOM. */
const CUSTOM = 'custom';

/** Action type for REMOVE. */
const REMOVE = 'remove';

/** A type union of notification level properties. */
export const Level = {
  INFO: INFO,
  SUCCESS: SUCCESS,
  WARNING: WARNING,
  ERROR: ERROR,
  CUSTOM: CUSTOM,
} as const;

export type Level = typeof Level[keyof typeof Level];

/** A {Notification} context. */
export type Notification = {
  key: string;
  level: Level;
  title: string;
  message: string;
  ttl: number;
  //  icon?: string | React.ReactNode | FontAwesome.Props;
  //  showCloseButton?: boolean;
  //  onClick?: () => void;
  //  onHide?: () => void;
};

/** FSA action factory. */
const ACTION_CREATER = actionCreatorFactory();

/** INFO action creator. */
const INFO_ACTION = ACTION_CREATER<Notification>(INFO);

/** SUCCESS action creator. */
const SUCCESS_ACTION = ACTION_CREATER<Notification>(SUCCESS);

/** WARNING action creator. */
const WARNING_ACTION = ACTION_CREATER<Notification>(WARNING);

/** ERROR action creator. */
const ERROR_ACTION = ACTION_CREATER<Notification>(ERROR);

/** CUSTOM action creator. */
const CUSTOM_ACTION = ACTION_CREATER<Notification>(CUSTOM);

/** REMOVE action creator. */
const REMOVE_ACTION = ACTION_CREATER<string>(REMOVE);

/** INFO action. */
export const info = (
  key: string,
  title: string,
  message: string,
  ttl: number
): FSA.Action<Notification> => {
  return INFO_ACTION({
    key: key,
    level: Level.INFO,
    title: title,
    message: message,
    ttl: ttl,
  } as Notification);
};

/** SUCCESS action. */
export const success = (
  key: string,
  title: string,
  message: string,
  ttl: number
): FSA.Action<Notification> => {
  return SUCCESS_ACTION({
    key: key,
    level: Level.SUCCESS,
    title: title,
    message: message,
    ttl: ttl,
  } as Notification);
};

/** WARNING action. */
export const warning = (
  key: string,
  title: string,
  message: string,
  ttl: number
): FSA.Action<Notification> => {
  return WARNING_ACTION({
    key: key,
    level: Level.WARNING,
    title: title,
    message: message,
    ttl: ttl,
  } as Notification);
};

/** ERROR action. */
export const error = (
  key: string,
  title: string,
  message: string,
  ttl: number
): FSA.Action<Notification> => {
  return ERROR_ACTION({
    key: key,
    level: Level.ERROR,
    title: title,
    message: message,
    ttl: ttl,
  } as Notification);
};

/** CUSTOM action. */
export const custom = (
  key: string,
  title: string,
  message: string,
  ttl: number
): FSA.Action<Notification> => {
  return CUSTOM_ACTION({
    key: key,
    level: Level.CUSTOM,
    title: title,
    message: message,
    ttl: ttl,
  } as Notification);
};

/** REMOVE action. */
export const remove = (key: string): FSA.Action<string> => {
  return REMOVE_ACTION(key);
};

/** A {State} type. */
export type State = {
  list: Notification[];
};

/** An initial state of the module. */
const INITIAL_STATE = {
  list: [],
} as State;

/** A reducer of the module. */
const reducer = (
  state: State = INITIAL_STATE,
  action: FSA.Action<Notification>
): State => {
  switch (action.type) {
    case INFO:
    case SUCCESS:
    case WARNING:
    case ERROR:
    case CUSTOM:
      return {
        ...state,
        aueue: [...state.list, action.payload],
      } as State;
    case REMOVE:
      return {
        ...state,
        aueue: state.list.filter((n) => action.payload !== n.key),
      } as State;
    default:
      return state;
  }
};

export default reducer;
