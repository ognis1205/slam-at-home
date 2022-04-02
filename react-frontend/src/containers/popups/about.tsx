/**
 * @fileoverview Defines About component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Description from './description';
import * as Window from './window';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
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
    <Description.Component>
      {
        // eslint-disable-next-line prettier/prettier
      }This application is a part of SLAM@HOME project. For more details such as usage restrictions, please refer to the link below.
    </Description.Component>
    <table className={styles['table']}>
      <tbody className={styles['tbody']}>
        <tr className={styles['item']}>
          <td className={styles['name']}>
            <span className={styles['icon']}>
              <FontAwesome.FontAwesomeIcon
                icon={FontAwesomeIcon.faCodeBranch}
              />
            </span>
            Version
          </td>
          <td className={styles['value']}>0.1.0</td>
        </tr>
        <tr className={styles['item']}>
          <td className={styles['name']}>
            <span className={styles['icon']}>
              <FontAwesome.FontAwesomeIcon icon={FontAwesomeIcon.faGlobe} />
            </span>
            Website
          </td>
          <td className={styles['value']}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/ognis1205/slam-at-home"
            >
              slam-at-home
            </a>
          </td>
        </tr>
        <tr className={styles['item']}>
          <td className={styles['name']}>
            <span className={styles['icon']}>
              <FontAwesome.FontAwesomeIcon icon={FontAwesomeIcon.faUser} />
            </span>
            Developer
          </td>
          <td className={styles['value']}>Shingo OKAWA</td>
        </tr>
      </tbody>
    </table>
  </Window.Component>
);

/** Sets the component's display name. */
Component.displayName = 'About';
