/**
 * @fileoverview Defines Content component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Context from './context';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';
import classnames from 'classnames';
import styles from '../../assets/styles/components/modal.module.scss';

/** Returns the container element of a modal content. */
const getContainer = (container: DOM.Identifier): HTMLElement =>
  DOM.get(container);

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
      id,
      isOpen,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      openHandler,
      closeHandler,
      mouseEnterHandler,
      mouseLeaveHandler,
    } = React.useContext(Context.Modal);

    /** @const Holds `true` if the component is modal. */
    const isModal = modal ? true : !trigger;

    /** @const Holds `true` if the component has `hover` event handler. */
    const hasHover = !modal && on.indexOf('hover') >= 0;

    /** `componentDidMount` */
    Hook.useDidMount(() => {
      if (isOpen) {
        if (getContainer(container)?.parentNode === document.body)
          CURRENT_MODAL[id] = isOpen;
        scrollLocker?.lock();
      }
    });

    /** `componentDidUpdate` */
    Hook.useDidUpdate(() => {
      if (getContainer(container)?.parentNode === document.body)
        CURRENT_MODAL[id] = !!isOpen;
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
        onMouseEnter={hasHover ? mouseEnterHandler : handleNothing}
        onMouseLeave={hasHover ? mouseLeaveHandler : handleNothing}
      >
        {children && typeof children === 'function'
          ? children(closeHandler, isOpen)
          : children}
      </div>
    );
  }
);

/** Sets the component's display name. */
Component.displayName = 'ModalContent';
