/**
 * @fileoverview Defines Window component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Button from './button';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import styles from '../../assets/styles/containers/popups.module.scss';

/** Returns a `Container` component. */
const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { children, ...divProps }: React.HTMLAttributes<HTMLDivElement>,
    ref
  ): React.ReactElement => (
    <div {...divProps} ref={ref} className={styles['window']}>
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
  icon,
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
        <Button.Component
          className={styles['close']}
          icon={FontAwesomeIcon.faDotCircle}
          onClick={handleClose}
        />
      </Controller>
      <Pager>{children}</Pager>
    </Container>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Window';
