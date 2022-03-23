/**
 * @fileoverview Defines Notification state.
 * @copyright Shingo OKAWA 2022
 */
import * as FSA from 'typescript-fsa';
import actionCreatorFactory from 'typescript-fsa';
import { v4 as uuid } from 'uuid';

/** Action suffix. */
const SUFFIX = 'notifications';

/** Action type for INFO. */
const INFO = `${SUFFIX}/info`;

/** Action type for SUCCESS. */
const SUCCESS = `${SUFFIX}/success`;

/** Action type for WARNING. */
const WARNING = `${SUFFIX}/warning`;

/** Action type for ERROR. */
const ERROR = `${SUFFIX}/error`;

/** Action type for CUSTOM. */
const CUSTOM = `${SUFFIX}/custom`;

/** Action type for REMOVE. */
const REMOVE = `${SUFFIX}/remove`;

/** Returns true if the action is notification. */
export const isNotification = (action: string): boolean =>
  action.startsWith(SUFFIX);

/** A type union of notification level properties. */
export const Level = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  CUSTOM: 'custom',
} as const;

export type Level = typeof Level[keyof typeof Level];

/** A notification {Item}. */
export type Item = {
  key: string;
  level: Level;
  title: string;
  message: string;
  ttl: number;
  showCloseButton?: boolean;
  onClick?: () => void;
  onHide?: () => void;
};

/** FSA action factory. */
const ACTION_CREATER = actionCreatorFactory();

/** INFO action creator. */
const INFO_ACTION = ACTION_CREATER<Item>(INFO);

/** SUCCESS action creator. */
const SUCCESS_ACTION = ACTION_CREATER<Item>(SUCCESS);

/** WARNING action creator. */
const WARNING_ACTION = ACTION_CREATER<Item>(WARNING);

/** ERROR action creator. */
const ERROR_ACTION = ACTION_CREATER<Item>(ERROR);

/** CUSTOM action creator. */
const CUSTOM_ACTION = ACTION_CREATER<Item>(CUSTOM);

/** REMOVE action creator. */
const REMOVE_ACTION = ACTION_CREATER<string>(REMOVE);

/** Returns new payload. */
const newPayload = (options: Partial<Item>, level: Level): Item => {
  const notify = {
    key: uuid(),
    level: level,
    title: null,
    message: null,
    ttl: 5000,
  } as Item;
  return Object.assign(notify, options);
};

/** Parses a given message. */
const parse = (maybeOptions: string | Partial<Item>): Partial<Item> => {
  if (typeof maybeOptions === 'string') return { message: maybeOptions };
  else return maybeOptions;
};

/** INFO action. */
export const info = (maybeOptions: string | Partial<Item>): FSA.Action<Item> =>
  INFO_ACTION(newPayload(parse(maybeOptions), Level.INFO));

/** SUCCESS action. */
export const success = (
  maybeOptions: string | Partial<Item>
): FSA.Action<Item> =>
  SUCCESS_ACTION(newPayload(parse(maybeOptions), Level.SUCCESS));

/** WARNING action. */
export const warning = (
  maybeOptions: string | Partial<Item>
): FSA.Action<Item> =>
  WARNING_ACTION(newPayload(parse(maybeOptions), Level.WARNING));

/** ERROR action. */
export const error = (maybeOptions: string | Partial<Item>): FSA.Action<Item> =>
  ERROR_ACTION(newPayload(parse(maybeOptions), Level.ERROR));

/** CUSTOM action. */
export const custom = (
  maybeOptions: string | Partial<Item>
): FSA.Action<Item> =>
  CUSTOM_ACTION(newPayload(parse(maybeOptions), Level.CUSTOM));

/** REMOVE action. */
export const remove = (key: string): FSA.Action<string> => {
  return REMOVE_ACTION(key);
};

/** A {State} type. */
export type State = {
  list: Item[];
};

/** An initial state of the module. */
const INITIAL_STATE = {
  list: [],
} as State;

/** A reducer of the module. */
const reducer = (
  state: State = INITIAL_STATE,
  action: FSA.Action<Item>
): State => {
  switch (action.type) {
    case INFO:
    case SUCCESS:
    case WARNING:
    case ERROR:
    case CUSTOM:
      return {
        ...state,
        list: [...state.list, action.payload],
      } as State;
    case REMOVE:
      return {
        ...state,
        list: state.list.filter((n) => action.payload.key !== n.key),
      } as State;
    default:
      return state;
  }
};

export default reducer;
