/**
 * @fileoverview Defines lagacy React life-cycle method equivalents.
 */
import * as React from 'react';

/**
 * An equivalent for the legacy `componentDidMount` life-cycle method.
 * @param {() => void} callback The callback function.
 */
export const useDidMount = (callback: () => void): void => {
  React.useEffect(() => {
    callback();
  }, []);
};

/**
 * An equivalent for the legacy `componentDidMount` life-cycle method.
 * @param {() => void} callback The callback function.
 * @param {any[]} dependencies The dependencies.
 */
export const useDidUpdate = (callback: () => void, dependencies?: any[]): void => {
  const hasMounted = React.useRef(false)
  React.useEffect(() => {
    if (hasMounted.current) callback();
    else hasMounted.current = true
  }, dependencies);
};

/**
 * An equivalent for the legacy `componentWillUnmount` life-cycle method.
 * @param {() => void} callback The callback function.
 */
export const useWillUnmount = (callback: () => void): void => {
  React.useEffect(() => {
    return () => {
      callback();
    };
  }, []);
};
