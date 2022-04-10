/**
 * @fileoverview Defines App reducer.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import notification from './notification';
import signaling from './signaling';
import rtc from './rtc';

/** A combined reducer. */
const reducer = Redux.combineReducers({
  notification: notification,
  signaling: signaling,
  rtc: rtc,
});

export default reducer;
