/**
 * @fileoverview Defines About component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import Image from 'next/image';
import styles from '../../assets/styles/containers/popups.module.scss';

/** Returns a `Description` component. */
export const Component: React.FunctionComponent<Props.Description> = ({
  children,
  ...divProps
}: Props.description): React.ReactElement => (
  <div className={styles['title']} {...divProps}>
    <div className={styles['logo']}>
      <Image
        src="/images/logo_box.png"
        alt="SLAM@HOME"
        width="96"
        height="96"
      />
    </div>
    <div className={styles['description']}>{children}</div>
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Description';
