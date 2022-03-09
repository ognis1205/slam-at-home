/**
 * @fileoverview Defines Window component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import styles from '../../assets/styles/containers/window.module.scss';

/** Returns a `Window` component. */
export const Component: React.FunctionComponent<Props.Window> = ({
  children,
  ...divProps
}: Props.Window): React.ReactElement => {
  return (
    <div className={styles['window']} {...divProps}>
      {children}
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Window';
