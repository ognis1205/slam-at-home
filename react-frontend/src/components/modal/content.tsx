/**
 * @fileoverview Defines Content component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import classnames from 'classnames';
import styles from '../../assets/styles/components/modal.module.scss';

/** Returns the class name of the content. */
const getClassName = (className: string, isModal: boolean): string =>
  classnames(styles['content'], {
    [className || '']: !!className,
    [styles['modal'] || styles['tooltip']]: isModal,
  });

/** Returns a `Content` component. */
export const Component = React.forwardRef<HTMLDivElement, Props.Content>(
  (
    {
      children,
      className,
      open,
      defaultOpen,
      disabled,
      modal,
      trigger,
      delay,
      on,
      onOpen,
      onClose,
      ...divAttrs
    }: Props.Content,
    ref: React.Ref<HTMLDivElement>
  ): React.ReactElement => {
    /** @const Holds `true` if the component is open. */
    const [isOpen, setOpen] = React.useState<boolean>(open || defaultOpen);

    /** @const Holds `true` if the component is modal. */
    const isModal = modal ? true : !trigger;

    /** @const Holds `true` if the component has `hover` event handler. */
    const hasHover = !modal && on.indexOf('hover') >= 0;

    /** @const Holds a mouse enter effect. */
    const timeout = React.useRef<ReturnType<typeof setTimeout>>(null);

    const handleOpen = (e?: React.SyntheticEvent) => {
      if (isOpen || disabled) return;
      setOpen(true);
      setTimeout(() => onOpen(e), 0);
    };

    const handleClose = (
      event?: React.SyntheticEvent | KeyboardEvent | TouchEvent | MouseEvent
    ) => {
      if (!isOpen || disabled) return;
      setOpen(false);
//      if (isModal) (focusedElBeforeOpen.current as HTMLElement)?.focus();
      setTimeout(() => onClose(event), 0);
    };

    /** An event handler called on `click` events. */
    const handleClick = (e: React.MouseEvent<unknown>): void =>
      e.stopPropagation();

    /** An event handler called on `mouseenter` events. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleNothing = (e?: React.SyntheticEvent) => {
      // Do nothing.
    };

    /** An event handler called on `mouseenter` events. */
    const handleMouseEnter = (e?: React.SyntheticEvent) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => handleOpen(e), delay);
    };

    /** An event handler called on `mouseleave` events. */
    const handleMouseLeave = (e?: React.SyntheticEvent) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => handleClose(e), delay);
    };

    return (
      <div
        {...divAttrs}
        key="C"
        ref={ref}
        role={isModal ? 'dialog' : 'tooltip'}
        className={getClassName(className, isModal)}
        onClick={handleClick}
        onMouseEnter={hasHover ? handleMouseEnter : handleNothing}
        onMouseLeave={hasHover ? handleMouseLeave : handleNothing}
      >
        {children}
      </div>
    );
  }
);

/** Sets the component's display name. */
Component.displayName = 'ModalContent';
