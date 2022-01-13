/**
 * @fileoverview Defines Left component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
//import classnames from 'classnames';
import styles from '../../assets/styles/containers/pane.module.scss';

/** Returns the class name of the wrapper. */
//const getClassName = (className: string): string =>
//  classnames({
//    [className || '']: !!className,
//  });

/** Returns a `Left` component. */
export const Component: React.FunctionComponent<Props.Left> = (
  props: Props.Left
): React.ReactElement => <div id={styles['left']}>{props.children}</div>;

/** Sets the component's display name. */
Component.displayName = 'LeftPane';
