/**
 * @fileoverview Defines Item component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as FAUtil from '../../utils/fontawesome';
import * as Hook from '../../utils/hook';
import * as Wrap from '../../utils/wrap';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styles from '../../assets/styles/components/notification.module.scss';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Item> = {
  level: 'info',
  title: null,
  message: null,
  showCloseButton: true,
  ttl: 5000,
  onClick: () => {
    // Do nothing.
  },
  onHide: () => {
    // Do nothign.
  },
};

/** Returns the class name of the notification. */
const getClassName = (className: string, level: string): string =>
  classnames(styles['item'], styles[`${level}`], {
    [className || '']: !!className,
  });

/** Returns a `Item` component. */
export const Component: React.FunctionComponent<Props.Item> = ({
  className,
  level,
  title,
  message,
  ttl,
  icon,
  showCloseButton,
  onClick,
  onHide,
  style,
  ...divAttrs
}: Props.Item): React.ReactElement => {
  /** @const Holds a motion effect. */
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(null);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    if (ttl !== 0) {
      timeout.current = setTimeout(handleHide, ttl);
    }
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    if (ttl !== 0) clearTimeout(timeout.current);
  });

  /** Event listener which is responsible for `onClick`. */
  const handleClick = (): void => {
    if (onClick) onClick();
  };

  /** Event listener which is responsible for `onHide`. */
  const handleHide = (): void => {
    if (onHide) onHide();
  };

  /** Icon element. */
  const iconElement = FAUtil.isProps(icon) ? (
    <span className={styles['icon']}>
      <FontAwesome.FontAwesomeIcon icon={icon} />
    </span>
  ) : (
    <span className={styles['icon']}>{icon}</span>
  );

  /** Close button element. */
  const closeButton = showCloseButton ? (
    <span className={styles['close-button']} onClick={handleHide}>
      <i className={styles['close-icon']} />
    </span>
  ) : null;

  /** Title element. */
  const titleElement = title ? (
    <h4 className={styles['title']}>
      {title}
      {closeButton}
    </h4>
  ) : null;

  return (
    <div
      {...divAttrs}
      className={getClassName(className, level)}
      style={style}
    >
      {iconElement}
      <div className={styles['content']} onClick={handleClick}>
        {titleElement}
        <div className={styles['message']}>{message}</div>
      </div>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'NotificationItem';

/** Returns a `Item` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Item> =
  Wrap.withDefaultProps(Component, DEFAULT_PROPS);
