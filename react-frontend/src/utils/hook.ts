/**
 * @fileoverview Defines lagacy React life-cycle method equivalents.
 */
import * as React from 'react';
import { dequal } from 'dequal';

// `useEffect` parameters.
type UseEffectParams = Parameters<typeof React.useEffect>;
// `useEffect` callback function.
type UseEffectCallback = UseEffectParams[0];
// `useEffect` dependencies list.
type UseEffectDeps = UseEffectParams[1];
// `useEffect` return..
type UseEffectReturn = ReturnType<typeof React.useEffect>

/**
 * Deeply compared version of `useMemo`.
 * @param {T} value the value to be memoized.
 * @returns a memoized version of the value as long as it remains deeply equal.
 */
export const useDeepComparedMemo = <T>(value: T): T => {
  const ref = React.useRef<T>(value);
  const sig = React.useRef<number>(0);
  if (!dequal(value, ref.current)) {
    ref.current = value;
    sig.current += 1;
  }
  return React.useMemo<T>(() => ref.current, [sig.current]);
};

/**
 * Deeply compared version of `useEffect`.
 * @param {() => void} callback The callback function.
 * @param {any[]} dependencies The dependencies.
 */
export const useDeepComparedEffect = (
  callback: UseEffectCallback,
  deps: UseEffectDeps
): UseEffectReturn =>
  React.useEffect(callback, useDeepComparedMemo(deps));

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
    else hasMounted.current = true;
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

/**
 * Returns the previous value of a specified variable.
 * @param {T} value the value to be memoized.
 * @returns a previously memoized version of the value..
 */
export const usePrevious= <T>(value: T): T => {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
