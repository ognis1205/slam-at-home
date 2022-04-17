/**
 * @fileoverview Defines NoSignal component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeSolidIcon from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import styles from '../../assets/styles/components/players.module.scss';

/** Returns the class name of the video. */
const getClassName = (className: string): string =>
  classnames(styles['nosignal'], {
    [className || '']: !!className,
  });

/** Returns a `Nosignal` component. */
export const Component: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = ({
  className,
  ...divAttrs
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div {...divAttrs} className={getClassName(className)}>
    <FontAwesome.FontAwesomeIcon icon={FontAwesomeSolidIcon.faVideoSlash} />
  </div>
);

/** Sets the component's display name. */
Component.displayName = 'Nosignal';
