/**
 * @fileoverview Defines Video component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';
import classnames from 'classnames';
import styles from '../../assets/styles/components/players.module.scss';

/** Returns the class name of the video. */
const getClassName = (className: string): string =>
  classnames(styles['video'], {
    [className || '']: !!className,
  });

/** Returns a `Video` component. */
export const Component: React.FunctionComponent<Props.Video> = ({
  className,
  stream,
  ...divAttrs
}: Props.Video): React.ReactElement => {
  /** @const Holds a reference to the video. */
  const video = React.useRef<HTMLVideoElement>(null);

  const play = (): void => {
    if (video.current && video.current.srcObject !== stream) {
      video.current.srcObject = stream;

      video.current.oncanplay = function () {
        console.log(`video oncanplay`);
      };

      video.current.onplay = function () {
        console.log(`video onplay`);
      };

      video.current.onpause = function () {
        console.log(`video onpause`);
      };

      video.current.play();
    }
  };

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    if (!DOM.isDefined()) return;
    play();
  });

  /** `componentDidUpdate` */
  Hook.useDidUpdate(() => {
    if (!DOM.isDefined()) return;
    play();
  });

  return (
    <div {...divAttrs} className={getClassName(className)}>
      {stream ? (
        <video className={styles['display']} ref={video} />
      ) : (
        <span>no stream fontawesome icon here</span>
      )}
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Video';
