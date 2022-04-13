/**
 * @fileoverview Defines Video component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import classnames from 'classnames';
import styles from '../../assets/styles/components/players.module.scss';

/** Returns the class name of the video. */
const getClassName = (className: string): string =>
  classnames(styles['video'], {
    [className || '']: !!className,
  });

export const Component = React.forwardRef<HTMLVideoElement, Props.Video>(
  (
    { className, isReady, ...divAttrs }: Props.Video,
    ref
  ): React.ReactElement => (
    <div {...divAttrs} className={getClassName(className)}>
      {isReady ? (
        <video className={styles['display']} ref={ref} />
      ) : (
        <span>no stream fontawesome icon here</span>
      )}
    </div>
  )
);

/** Sets the component's display name. */
Component.displayName = 'Video';
