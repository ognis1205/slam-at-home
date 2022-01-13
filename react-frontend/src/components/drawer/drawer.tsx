/**
 * @fileoverview Defines Drawer component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Content from './content';
import * as Props from './props';
import * as Portal from '../portal';
import * as Wrap from '../../utils/wrap';
import classnames from 'classnames';
import styles from '../../assets/styles/components/drawer.module.scss';

/** Default properties. */
const DEFAULT_PROPS: Partial<Props.Drawer> = {
  placement: 'left',
  container: 'body',
  defaultOpen: false,
  drawPane: 'all',
  drawDuration: '.2s',
  drawEase: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  onChange: () => {
    /* Do nothing. */
  },
  afterVisibleChange: () => {
    /* Do nothing. */
  },
  handler: (
    <div className={styles['handle']}>
      <i className={styles['icon']} />
    </div>
  ),
  showMask: true,
  maskClosable: true,
  maskStyle: {},
  className: '',
  keyboard: true,
  forceRender: false,
  autoFocus: true,
};

/** Returns the class name of the wrapper. */
const getClassName = (className: string): string =>
  classnames({
    [className || '']: !!className,
  });

/** Returns a `Drawer` component. */
const Component: React.FunctionComponent<Props.Drawer> = ({
  className,
  container,
  forceRender,
  defaultOpen,
  onClick,
  onClose,
  open,
  ...commonProps
}: Props.Drawer): React.ReactElement => {
  /** @const Holds a open state. */
  const [isOpen, setOpen] = React.useState<boolean>(
    typeof open !== 'undefined' ? open : !!defaultOpen
  );

  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** `getDerivedStateFromProps` */
  React.useEffect(() => {
    setOpen(open);
  }, [open]);

  /** An event handler called on 'clickevent' events. */
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (onClick) onClick(e);
    if (typeof open === 'undefined') setOpen(!isOpen);
  };

  /** An event handler called on 'clickevent' events. */
  const handleClose = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (onClose) onClose(e);
    if (typeof open === 'undefined') setOpen(false);
  };

  if (!container)
    return (
      <div
        className={getClassName(className)}
        ref={(el) => (self.current = el)}
      >
        <Content.Component
          {...commonProps}
          open={isOpen}
          container={() => self.current as HTMLElement}
          onClose={handleClose}
          onClick={handleClick}
        />
      </div>
    );
  else
    return (
      <Portal.Wrapper
        visible={isOpen}
        forceRender={!!commonProps.handler || forceRender}
        container={container}
        className={getClassName(className)}
      >
        {({ visible, afterClose, ...rest }: Props.Content) => (
          <Content.Component
            {...commonProps}
            {...rest}
            open={visible !== undefined ? visible : isOpen}
            afterVisibleChange={
              afterClose !== undefined
                ? afterClose
                : commonProps.afterVisibleChange
            }
            onClose={handleClose}
            onClick={handleClick}
          />
        )}
      </Portal.Wrapper>
    );
};

/** Sets the component's display name. */
Component.displayName = 'Drawer';

/** Returns a `Drawer` component with default property values. */
export const WithDefaultComponent: React.FunctionComponent<Props.Drawer> =
  Wrap.withDefaultProps(Component, DEFAULT_PROPS);
