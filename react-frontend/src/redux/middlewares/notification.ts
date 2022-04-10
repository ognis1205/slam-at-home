/**
 * @fileoverview Defines Notification middleware.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import * as Events from 'events';
import * as FSA from 'typescript-fsa';
import * as Store from '../store';
import * as Notification from '../modules/notification';

/** Responsible to emit notification events. */
class Notifier extends Events.EventEmitter {
  // Placeholder.
}

/** Singleton manager. */
const SHARED = new Notifier();

/** Notifies a given notification items. */
const notify = (items: Notification.Item[]): void => {
  SHARED.emit('notified', items);
};

/** Adds a notification event listener. */
export const addNotificationListener = (
  callback: (items: Notification.Item[]) => void
): void => {
  SHARED.addListener('notified', callback);
};

/** Removes a notification event listener. */
export const removeNotificationListener = (
  callback: (items: Notification.Item[]) => void
): void => {
  SHARED.removeListener('notified', callback);
};

/** Notification middleware. */
export const middleware: Redux.Middleware =
  <S extends Store.Type>({
    getState,
  }: Redux.MiddlewareAPI<Redux.Dispatch, S>) =>
  (next: Redux.Dispatch<Redux.AnyAction>) =>
  (action: FSA.Action<unknown>): unknown => {
    if (Notification.hasAction(action))
      setTimeout(() => notify(getState()?.notification?.list));
    return next(action);
  };
