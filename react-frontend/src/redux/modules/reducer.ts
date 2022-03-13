/**
 * @fileoverview Defines App reducer.
 * @copyright Shingo OKAWA 2022
 */
import * as Redux from 'redux';
import notifications from './notifications';

/** A combined reducer. */
const reducer = Redux.combineReducers({
  notifications: notifications,
});

export default reducer;
