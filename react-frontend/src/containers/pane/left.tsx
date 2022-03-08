/**
 * @fileoverview Defines Left component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import styles from '../../assets/styles/containers/pane.module.scss';

/** Returns a `Left` component. */
export const Component: React.FunctionComponent<Props.Left> = ({
  children,
  ...divProps
}: Props.Left): React.ReactElement => (
  <div id={styles['left']} {...divProps}>
    {children}
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'LeftPane';
