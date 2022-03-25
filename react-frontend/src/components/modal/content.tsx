/**
 * @fileoverview Defines Content component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Context from './context';
import classnames from 'classnames';
import styles from '../../assets/styles/components/modal.module.scss';

/** Returns the class name of the content. */
const getClassName = (className: string, isModal: boolean): string =>
  classnames(styles['content'], {
    [className || '']: !!className,
    [styles['modal'] || styles['tooltip']]: isModal,
  });

/** @const Holds a current drawer flags. */
const CURRENT_MODAL: Record<string, boolean> = {};

/** Returns a `Content` component. */
export const Component = React.forwardRef<HTMLDivElement, Props.Content>(
  (
    {
      children,
      className,
      container,
      scrollLocker,
      modal,
      trigger,
      on,
      ...divAttrs
    }: Props.Content,
    ref: React.Ref<HTMLDivElement>
  ): React.ReactElement => {
    /** @const Holds modal context. */
    const {
      isOpen,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handleOpen,
      handleClose,
      handleMouseEnter,
      handleMouseLeave,
    } = React.useContext(Context.Modal);

    /** @const Holds a component's identifier. */
    const id = React.useRef<string>(
      `modal_id_${Number(
        (Date.now() + Math.random())
          .toString()
          .replace('.', Math.round(Math.random() * 9).toString())
      ).toString(16)}`
    );

    /** @const Holds `true` if the component is modal. */
    const isModal = modal ? true : !trigger;

    /** @const Holds `true` if the component has `hover` event handler. */
    const hasHover = !modal && on.indexOf('hover') >= 0;

    /** `componentDidMount` */
    Hook.useDidMount(() => {
      if (isOpen) {
        if (getContainer(container)?.parentNode === document.body)
          CURRENT_MODAL[id.current] = isOpen;
        scrollLocker?.lock();
      }
    });

    /** `componentDidUpdate` */
    Hook.useDidUpdate(() => {
      if (getContainer(container)?.parentNode === document.body)
        CURRENT_MODAL[id.current] = !!isOpen;
      if (isOpen) scrollLocker?.lock();
      else scrollLocker?.unlock();
    }, [isOpen]);

    /** An event handler called on `click` events. */
    const handleClick = (e: React.MouseEvent<unknown>): void =>
      e.stopPropagation();

    /** An event handler called on `mouseenter` events. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleNothing = (e?: React.SyntheticEvent) => {
      // Do nothing.
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
        {children && typeof children === 'function'
          ? children(handleClose, isOpen)
          : children}
      </div>
    );
  }
);

/** Sets the component's display name. */
Component.displayName = 'ModalContent';
