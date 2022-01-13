/**
 * @fileoverview Defines ref utilities.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';

/** Fills a specified `ref` with a given `node`. */
export const fill = <T>(ref: React.Ref<T>, node: T): void => {
  if (typeof ref === 'function') ref(node);
  else if (typeof ref === 'object' && ref && 'current' in ref)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ref as any).current = node;
};
