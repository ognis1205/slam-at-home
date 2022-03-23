/**
 * @fileoverview Defines FontAwesome Icon types.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
//import * as FontAwesome from '@fortawesome/free-solid-svg-icons';
//import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';

/** Type guard for `FontAwesome.Props`. */
export const isProps = (
  value: string | React.ReactNode | FontAwesome.IconProp
): value is FontAwesome.IconProp => {
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
