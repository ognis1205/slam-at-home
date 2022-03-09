/**
 * @fileoverview Defines Header component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import Image from 'next/image';
import styles from '../../assets/styles/containers/menu.module.scss';

/** Returns a `Header` component. */
export const Component: React.FunctionComponent<Props.Header> = (
  props: Props.Header
): React.ReactElement => (
  <div className={styles['header']} {...props}>
    <Image src="/images/logo.png" alt="SLAM@Home" width="48" height="48" />
    <span className={styles['title']}>SLAM@HOME</span>
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'MenuHeader';
