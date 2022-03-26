/**
 * @fileoverview Defines {Portal} component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Hook from '../../utils/hook';

/** Returns the container element of a portal. */
const getContainer = ({ container }: Props.Portal): HTMLElement =>
  DOM.get(container);

/** Defines `Portal` reference type. */
export type Ref = Record<string, unknown>;

/** Returns a `Portal` component. */
export const Component = React.forwardRef<Ref, Props.Portal>(
  (props: Props.Portal, ref: React.ForwardedRef<Ref>): React.ReactElement => {
    /** Returns nothing but defines instance just for the existence check in a wrapper. */
    React.useImperativeHandle(ref, () => ({}));

    /** @const Holds a reference to the portal container element. */
    const container = React.useRef<HTMLElement>(null);

    /** @const Holds a state specifies whether this portal is mounted or not. */
    const [mounted, setMounted] = React.useState<boolean>(false);

    // Creates a container in a client side with sync to avoid useEffect get not any references.
    Hook.useDidMount(() => {
      if (DOM.isDefined()) {
        container.current = getContainer(props);
        setMounted(true);
      }
    });

    return mounted
      ? ReactDOM.createPortal(props.children, container.current)
      : null;
  }
);

/** Sets the component's display name. */
Component.displayName = 'Portal';
