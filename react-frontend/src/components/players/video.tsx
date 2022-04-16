/**
 * @fileoverview Defines Video component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
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
  onCanPlay,
  onPlay,
  onPause,
  onLoadedMetadata,
  ...divAttrs
}: Props.Video): React.ReactElement => {
  /** @const Holds a reference to the video. */
  const video = React.useRef<HTMLVideoElement>(null);

  /** An event handler called on 'canplay' events. */
  const handleCanPlay = (e: Event): void => {
    if (onCanPlay) onCanPlay(e);
  };

  /** An event handler called on 'play' events. */
  const handlePlay = (e: Event): void => {
    if (onPlay) onPlay(e);
  };

  /** An event handler called on 'pause' events. */
  const handlePause = (e: Event): void => {
    if (onPause) onPause(e);
  };

  /** An event handler called on 'loadedmetadata' events. */
  const handleLoadedMetadata = (e: Event): void => {
    if (onLoadedMetadata) onLoadedMetadata(e, video.current);
  };

  const play = (): void => {
    const player = video.current;
    if (player && player.srcObject !== stream) {
      player.srcObject = stream;
      Event.addListener(player, 'canplay', handleCanPlay);
      Event.addListener(player, 'play', handlePlay);
      Event.addListener(player, 'pause', handlePause);
      Event.addListener(player, 'loadedmetadata', handleLoadedMetadata);
      player.play();
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
      <video className={styles['display']} ref={video} />
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Video';
