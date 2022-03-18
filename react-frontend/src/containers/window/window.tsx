/**
 * @fileoverview Defines Window component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as Button from './button';
import * as Controller from './controller';
import * as DOM from '../../utils/dom';
import { faCog, faWindowClose, faExpand, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import styles from '../../assets/styles/containers/window.module.scss';

/** Returns a `Window` component. */
export const Component: React.FunctionComponent<Props.Window> = ({
  children,
  ...divProps
}: Props.Window): React.ReactElement => {
  /** @const Holds a reference to the component itself. */
  const self = React.useRef<HTMLDivElement>(null);

  /** Event listener which is responsible for `onClick`. */
  const handleClick = (): void => {
    console.log(self);
    if (self.current) {
      console.log(self.current);
      console.log(DOM.vw(100));
      self.current.style.width = `${DOM.vw(100)}px`;
    }
  };

  /***/
  const sizeButton = (
    <Button.Component key={1} icon={faWindowMaximize} id={styles['size-button']} onClick={handleClick} />
  );

  return (
    <div ref={self} className={styles['window']} {...divProps}>
      <Controller.Component buttons={[sizeButton]} />
      {children}
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Window';
