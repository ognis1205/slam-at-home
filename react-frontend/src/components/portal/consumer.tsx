/**
 * @fileoverview Defines Consumer component.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';

/** Returns the container element of a portal consumer. */
const getContainer = ({container}: Props.Consumer): HTMLElement => {
  return DOM.get(container);
};

/** Defines `Portal.Consumer` reference type. */
export type Ref = {};

/**
 * Returns a `Consumer` component.
 * @param {Consumer} props Properties that defines a behaviour of this component.
 * @param {Ref} ref Dummy `ReactRef` object.
 * @return {ReactElement} A rendered React element.
 */
export const Component = React.forwardRef<Ref, Props.Consumer>((props: Props.Consumer, ref): React.ReactElement => {
  /** Returns nothing but defines instance just for the existence check in a wrapper. */
  React.useImperativeHandle(ref, () => ({}));
  
  /** @const Holds a reference to the portal container element. */
  const container = React.useRef<HTMLElement>(null);

  /** @const Holds a reference specifies whether this portal is mounted or not. */
  const hasMounted = React.useRef<boolean>(false);

  // Creates a container in a client side with sync to avoid useEffect get not any references.
  if (!hasMounted.current) {
    container.current = getContainer(props);
    hasMounted.current = true;
  }

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    container.current?.parentNode?.removeChild(container.current);
  });

  return container.current
    ? ReactDOM.createPortal(props.children, container.current)
    : null;
});