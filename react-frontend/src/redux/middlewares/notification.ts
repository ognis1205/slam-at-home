/**
 * @fileoverview Defines Notification middleware.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import * as Events from 'events';
import * as FSA from 'typescript-fsa';
import * as Notifications from '../modules/notifications';

/** Responsible to emit notification events. */
class Notifier extends Events.EventEmitter {
  // Placeholder.
}

/** Exports singleton manager. */
const SHARED = new Notifier();

/** Notifies a given notification items. */
const notify = (items: Notifications.Item[]): void => {
  SHARED.emit('notified', items);
};

/** Adds a notification event listener. */
export const addNotificationListener = (
  callback: (items: Notifications.Item[]) => void
): void => {
  SHARED.addListener('notified', callback);
};

/** Removes a notification event listener. */
export const removeNotificationListener = (
  callback: (items: Notifications.Item[]) => void
): void => {
  SHARED.removeListener('notified', callback);
};

/** Notification middleware. */
export const middleware: Redux.Middleware =
  <S extends Redux.AppStore>({
    getState,
  }: Redux.MiddlewareAPI<Redux.Dispatch, S>) =>
  (next: Redux.Dispatch<Redux.AnyAction>) =>
  (action: FSA.Action<unknonw>): unknown => {
    if (Notifications.isNotification(action.type)) {
      console.log(action);
      setTimeout(() => {
        const state = getState();
        const notifications = state.notifications;
        notify(notifications.list);
      });
    }
    return next(action);
  };
