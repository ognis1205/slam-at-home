/**
 * @fileoverview Defines Projector component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Animation from '../../utils/animation';
import classnames from 'classnames';
import styles from '../../assets/styles/components/players.module.scss';

/** Returns the class name of the video. */
const getClassName = (className: string): string =>
  classnames(styles['projector'], {
    [className || '']: !!className,
  });

/** Returns a `Projector` component. */
export const Component: React.FunctionComponent<Props.Projector> = ({
  className,
  context,
  ...divAttrs
}: Props.Projector): React.ReactElement => {
  /** @const Holds a reference to the container. */
  const container = React.useRef<HTMLDivElement>(null);

  /** @const Holds a reference to the `requestAnimationFrame` identifier. */
  const animation = React.useRef<number>(null);

  /** Starts the WebGL animatio. */
  React.useEffect(() => {
    const display = container.current;
    console.log(context);
    display.appendChild(context.renderer.getDOMElement());

    const animate = (): void => {
      animation.current = Animation.request(() => {
        animate();
      });
      context.renderer.render(context.scene, context.camera);
    };
    animate();

    return () => {
      Animation.clear(animation.current);
      display.removeChild(context.renderer.getDOMElement());
      context.renderer.stop();
      context.scene.stop();
      context.camera.stop();
    };
  }, [context]);

  return (
    <div {...divAttrs} ref={container} className={getClassName(className)} />
  );
};

/** Sets the component's display name. */
Component.displayName = 'Projector';
