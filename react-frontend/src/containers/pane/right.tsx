/**
 * @fileoverview Defines Right component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import styles from '../../assets/styles/containers/pane.module.scss';

/** Returns a `Right` component. */
export const Component: React.FunctionComponent<Props.Right> = ({
  children,
  ...divProps
}: Props.Left): React.ReactElement => (
  <div id={styles['right']} {...divProps}>
    {children}
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'RightPane';
