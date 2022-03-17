/**
 * @fileoverview Defines {Navigation} context.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';

/** A {TreeView} context type. */
export type ContextType = {
  activeKeyContext: [string | string[], (key: string) => void];
};

/** A {TreeView} conetx. */
export const TreeView = React.createContext<ContextType | null>(null);
