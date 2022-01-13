/**
 * @fileoverview Defines Right component.
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

/** Returns a `Right` component. */
export const Component: React.FunctionComponent<Props.Right> = (
  props: Props.Right
): React.ReactElement => <div id={styles['right']}>{props.children}</div>;

/** Sets the component's display name. */
Component.displayName = 'RightPane';
