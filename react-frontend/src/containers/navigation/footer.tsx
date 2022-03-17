/**
 * @fileoverview Defines Footer component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import styles from '../../assets/styles/containers/navigation.module.scss';

/** Returns a `Footer` component. */
export const Component: React.FunctionComponent<Props.Footer> = (
  props: Props.Footer
): React.ReactElement => (
  <div className={styles['footer']} {...props}>
    Copyright &#169; 2022 Shingo OKAWA
    <br />
    All Rights Reserved.
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Footer';
