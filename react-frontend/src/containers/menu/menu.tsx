/**
 * @fileoverview Defines Menu component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Modal from '../../components/modal';
import * as Hook from '../../utils/hook';
import classnames from 'classnames';
import styles from '../../assets/styles/components/menu.module.scss';

/** Returns the class name of the content. */
const getClassName = (className: string): string =>
  classnames(styles['menu'], {
    [className || '']: !!className,
  });

/** Returns a `Menu` component. */
export const Component = React.forwardRef<Modal.Trigger, Props.Content>(
  (
    { className, ...rest }: Props.Content,
    ref: React.ForwardedRef<Modal.Trigger>
  ): React.ReactElement => {
    return (
      <Modal.Component {...rest} className={getClassName(className)} ref={ref}>
        Popup content Here
      </Modal.Component>
    );
  }
);

/** Sets the component's display name. */
Component.displayName = 'Menu';
