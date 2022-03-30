/**
 * @fileoverview Defines Info component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Window from './window';
import * as Draggable from '../../components/draggable';
import styles from '../../assets/styles/containers/popus.module.scss';

/** Returns a `Info` component. */
export const Component: React.FunctionComponent<Props.Window> = ({
  ...windowProps
}: Props.Window): React.ReactElement => (
  <Window.Component {...windowProps} type="info" title="About">
    Info
  </Window.Component>
);

/** Sets the component's display name. */
Component.displayName = 'Info';
