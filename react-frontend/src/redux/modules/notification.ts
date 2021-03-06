/**
 * @fileoverview Defines Notification state.
 * @copyright Shingo OKAWA 2022
 */
import * as FSA from 'typescript-fsa';
import actionCreatorFactory from 'typescript-fsa';
import { v4 as uuid } from 'uuid';

/** Action suffix. */
const SUFFIX = 'notification';

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
const ACTION_CREATER = actionCreatorFactory(SUFFIX);

/** INFO action creator. */
export const INFO_ACTION = ACTION_CREATER<Item>(INFO);

/** SUCCESS action creator. */
export const SUCCESS_ACTION = ACTION_CREATER<Item>(SUCCESS);

/** WARNING action creator. */
export const WARNING_ACTION = ACTION_CREATER<Item>(WARNING);

/** ERROR action creator. */
export const ERROR_ACTION = ACTION_CREATER<Item>(ERROR);

/** CUSTOM action creator. */
export const CUSTOM_ACTION = ACTION_CREATER<Item>(CUSTOM);

/** REMOVE action creator. */
export const REMOVE_ACTION = ACTION_CREATER<string>(REMOVE);

/** Returns true if the action is notification. */
export const hasAction = (action: FSA.Action<unknown>): boolean =>
  INFO_ACTION.match(action) ||
  SUCCESS_ACTION.match(action) ||
  WARNING_ACTION.match(action) ||
  ERROR_ACTION.match(action) ||
  CUSTOM_ACTION.match(action) ||
  REMOVE_ACTION.match(action);

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
export const remove = (key: string): FSA.Action<string> => REMOVE_ACTION(key);

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
  action: FSA.Action<unknown>
): State => {
  if (
    FSA.isType(action, INFO_ACTION) ||
    FSA.isType(action, SUCCESS_ACTION) ||
    FSA.isType(action, WARNING_ACTION) ||
    FSA.isType(action, ERROR_ACTION) ||
    FSA.isType(action, CUSTOM_ACTION)
  ) {
    return {
      ...state,
      list: [...state.list, action.payload],
    } as State;
  } else if (FSA.isType(action, REMOVE_ACTION)) {
    return {
      ...state,
      list: state.list.filter((n) => action.payload !== n.key),
    } as State;
  }
  return state;
};

export default reducer;
