/**
 * @fileoverview Defines Button component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as FAUtil from '../../utils/fontawesome';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import styles from '../../assets/styles/containers/window.module.scss';

/** Returns a `Button` component. */
export const Component: React.FunctionComponent<Props.Button> = ({
  icon,
  title,
  onClick,
  ...spanProps
}: Props.Button): React.ReactElement => {
  /** Event listener which is responsible for `onClick`. */
  const handleClick = (): void => {
    if (onClick) onClick();
  };

  return FAUtil.isProps(icon) ? (
    <span
      {...spanProps}
      title={title}
      className={styles['button']}
      onClick={handleClick}
    >
      <FontAwesome.FontAwesomeIcon icon={icon} />
    </span>
  ) : (
    <span className={styles['button']}>{icon}</span>
  );
};

/** Sets the component's display name. */
Component.displayName = 'WindowButton';
