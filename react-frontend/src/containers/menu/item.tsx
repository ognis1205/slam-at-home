/**
 * @fileoverview Defines Item component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as FAUtil from '../../utils/fontawesome';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import styles from '../../assets/styles/containers/menu.module.scss';

/** Returns a `Item` component. */
export const Component: React.FunctionComponent<Props.Item> = ({
  icon,
  title,
  onClick,
  ...divAttrs
}: Props.Item): React.ReactElement => {
  /** An event handler called on `onclick` events. */
  const handleClick = (): void => {
    if (onClick) onClick();
  };

  /** Returns the corresponding FontAwesome icon. */
  const iconElement: React.ReactElement = FAUtil.isProps(icon) ? (
    <span className={styles['icon']}>
      <FontAwesome.FontAwesomeIcon icon={icon} />
    </span>
  ) : (
    <span className={styles['icon']}>{icon}</span>
  );

  return (
    <div {...divAttrs} className={styles['item']} onClick={handleClick}>
      {iconElement}
      <span className={styles['title']}>{title}</span>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Item';
