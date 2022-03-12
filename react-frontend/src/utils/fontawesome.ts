/**
 * @fileoverview Defines FontAwesome Icon types.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as FontAwesome from '@fortawesome/free-solid-svg-icons';

/** Type guard for `FontAwesome.Props`. */
export const isProps = (
  value: string | React.ReactNode | FontAwesome.Props
): value is FontAwesome.Props => {
  if (!value) {
    return false;
  } else if (typeof value === 'string') {
    return false;
  } else if (React.isValidElement(value)) {
    return false;
  } else {
    return true;
  }
};
