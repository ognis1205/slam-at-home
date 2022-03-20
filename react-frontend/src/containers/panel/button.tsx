/**
 * @fileoverview Defines Button component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as FAUtil from '../../utils/fontawesome';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styles from '../../assets/styles/containers/panel.module.scss';

/** Returns the class name of the icon. */
const getClassName = (className: string): string =>
  classnames(styles['button'], {
    [className || '']: !!className,
  });

/** Returns a `Button` component. */
export const Component: React.FunctionComponent<Props.Button> = ({
  icon,
  title,
  onClick,
  className,
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
      className={getClassName(className)}
      onClick={handleClick}
    >
      <FontAwesome.FontAwesomeIcon icon={icon} />
    </span>
  ) : (
    <span className={styles['button']}>{icon}</span>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Button';
