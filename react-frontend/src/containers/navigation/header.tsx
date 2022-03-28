/**
 * @fileoverview Defines Header component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import Image from 'next/image';
import styles from '../../assets/styles/containers/navigation.module.scss';

/** Returns a `Header` component. */
export const Component: React.FunctionComponent<Props.Header> = (
  props: Props.Header
): React.ReactElement => (
  <div className={styles['header']} {...props}>
    <div className={styles['logo']}>
      <Image
        src="/images/logo_box.png"
        alt="SLAM@HOME"
        width="96"
        height="96"
      />
    </div>
    {/*<div className={styles['buttons']}>
      <span className={styles['button']}>
        <Github.Component
          href="https://github.com/ognis1205/slam-at-home"
          dataShowCount="true"
          ariaLabel="Star ognis1205/slam-at-home on GitHub"
        />
      </span>
      <span className={styles['button']}>
        <Coffee.Component />
      </span>
    </div>*/}
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Header';
