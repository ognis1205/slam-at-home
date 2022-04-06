/**
 * @fileoverview Defines Window component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Button from './button';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeCore from '@fortawesome/fontawesome-svg-core';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import * as FontAwesomeBrandIcon from '@fortawesome/free-brands-svg-icons';
import classnames from 'classnames';
import styles from '../../assets/styles/containers/popups.module.scss';

/** Returns the corresponding FontAwesome icon. */
const getIcon = (type: Props.ItemType): FontAwesomeCore.IconDefinition => {
  switch (type) {
    case Props.ItemType.SETTING:
      return FontAwesomeIcon.faCog;
    case Props.ItemType.GITHUB:
      return FontAwesomeBrandIcon.faGithub;
    case Props.ItemType.GITTER:
      return FontAwesomeBrandIcon.faGitter;
    case Props.ItemType.SHARE:
      return FontAwesomeIcon.faShareSquare;
    case Props.ItemType.INFO:
    default:
      return FontAwesomeIcon.faInfoCircle;
  }
};

/** Returns a `Header` component. */
const Header: React.FunctionComponent<Props.Header> = ({
  type,
  title,
  ...divAttrs
}: Props.Header): React.ReactElement => (
  <div className={styles['header']} {...divAttrs}>
    <span className={styles['icon']}>
      <FontAwesome.FontAwesomeIcon icon={getIcon(type)} />
    </span>
    <span className={styles['title']}>{title}</span>
  </div>
);

/** Sets the component's display name. */
Header.displayName = 'Header';

/** Returns the class name of the icon. */
const getContainerClassName = (className: string): string =>
  classnames(styles['window'], {
    [className || '']: !!className,
  });

/** Returns a `Container` component. */
const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { children, className, ...divProps }: React.HTMLAttributes<HTMLDivElement>,
    ref
  ): React.ReactElement => (
    <div {...divProps} ref={ref} className={getContainerClassName(className)}>
      {children}
    </div>
  )
);

/** Sets the component's display name. */
Container.displayName = 'Container';

/** Returns a `Controller` component. */
export const Controller: React.FunctionComponent<Props.Controller> = ({
  children,
  ...divProps
}: Props.Controller): React.ReactElement => {
  return (
    <div className={styles['controller']} {...divProps}>
      {children}
    </div>
  );
};

/** Sets the component's display name. */
Controller.displayName = 'Controller';

/** Returns a `Pager` component. */
export const Pager: React.FunctionComponent<Props.Pager> = ({
  children,
  ...divProps
}: Props.Pager): React.ReactElement => {
  return (
    <div className={styles['pager']} {...divProps}>
      {children}
    </div>
  );
};

/** Sets the component's display name. */
Pager.displayName = 'Pager';

/** Returns a `Window` component. */
export const Component: React.FunctionComponent<Props.Window> = ({
  children,
  type,
  title,
  onClose,
  ...divProps
}: Props.Window): React.ReactElement => {
  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** Event listener which is responsible for `onClick`. */
  const handleClose = (): void => {
    if (onClose) onClose();
  };

  return (
    <Container {...divProps} ref={self}>
      <Controller>
        <Header type={type} title={title} />
        <Button.Component
          className={styles['close']}
          icon={FontAwesomeIcon.faTimesCircle}
          onClick={handleClose}
        />
      </Controller>
      <Pager>{children}</Pager>
    </Container>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Window';
