/**
 * @fileoverview Defines About component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Window from './window';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import styles from '../../assets/styles/containers/popups.module.scss';

/** Returns a `About` component. */
export const Component: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void;
  }
> = ({
  onClose,
  ...windowProps
}: React.HTMLAttributes<HTMLDivElement> & {
  onClose?: () => void;
}): React.ReactElement => (
  <Window.Component
    {...windowProps}
    className={styles['about']}
    type="info"
    title="About"
    onClose={onClose}
  >
    <div className={styles['info']}>
      <div className={styles['logo']}>
        <Image
          src="/images/logo_box.png"
          alt="SLAM@HOME"
          width="128"
          height="128"
        />
      </div>
      <div className={styles['table']}>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeIcon.faCodeBranch} />
          </span>
          <span className={styles['name']}>Version</span>
          <span className={styles['value']}>0.1.0</span>
        </div>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeIcon.faGlobe} />
          </span>
          <span className={styles['name']}>Website</span>
          <span className={styles['value']}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/ognis1205/slam-at-home"
            >
              slam-at-home
            </a>
          </span>
        </div>
        <div className={styles['item']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeIcon.faUser} />
          </span>
          <span className={styles['name']}>Developer</span>
          <span className={styles['value']}>Shingo OKAWA</span>
        </div>
      </div>
    </div>
    <div className={styles['copyright']}>
      Copyright &#169; 2022 Shingo OKAWA
      <br />
      All Rights Reserved.
    </div>
  </Window.Component>
);

/** Sets the component's display name. */
Component.displayName = 'About';
