/**
 * @fileoverview Defines About component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Window from './window';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import styles from '../../assets/styles/containers/popups.module.scss';

/** Returns a `Header` component. */
export const Header: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = (props: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div className={styles['title']} {...props}>
    <div className={styles['logo']}>
      <Image
        src="/images/logo_box.png"
        alt="SLAM@HOME"
        width="96"
        height="96"
      />
    </div>
    <div className={styles['description']}>
      This application is a part of SLAM@HOME project. For more details such as
      usage restrictions, please refer to the link below.
    </div>
  </div>
);

/** Sets the component's display name. */
Header.displayName = 'Header';

/** Returns a `Divider` component. */
const Divider: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> =
  ({
    ...divProps
  }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
    <div {...divProps} className={styles['divider']} />
  );

/** Sets the component's display name. */
Divider.displayName = 'Divider';

/** Returns a `Table` component. */
const Table: React.FunctionComponent<React.HTMLAttributes<HTMLTableElement>> =
  ({
    ...tableProps
  }: React.HTMLAttributes<HTMLTableElement>): React.ReactElement => (
    <table {...tableProps} className={styles['table']}>
      <tr className={styles['item']}>
        <td className={styles['name']}>
          <span className={styles['icon']}>
            <FontAwesome.FontAwesomeIcon icon={FontAwesomeIcon.faCodeBranch} />
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
    </table>
  );

/** Sets the component's display name. */
Table.displayName = 'Table';

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
    <Header />
    <Table />
  </Window.Component>
);

/** Sets the component's display name. */
Component.displayName = 'About';
