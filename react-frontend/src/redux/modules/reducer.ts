/**
 * @fileoverview Defines App reducer.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import notification from './notification';
import signaling from './signaling';

/** A combined reducer. */
const reducer = Redux.combineReducers({
  notification: notification,
  signaling: signaling,
});

export default reducer;
