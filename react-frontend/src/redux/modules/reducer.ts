/**
 * @fileoverview Defines App reducer.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import notification from './notification';
import signaling from './signaling';
import p2p from './p2p';

/** A combined reducer. */
const reducer = Redux.combineReducers({
  notification: notification,
  signaling: signaling,
  p2p: p2p,
});

export default reducer;
