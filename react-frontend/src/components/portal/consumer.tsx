/**
 * @fileoverview Defines Consumer component.
 * @copyright Shingo OKAWA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

  /** @const Holds a state specifies whether this portal is mounted or not. */
  const [mounted, setMounted] = React.useState<boolean>(false);

  // Creates a container in a client side with sync to avoid useEffect get not any references.
  Hook.useDidMount(() => {
    if (DOM.isDefined()) {
      container.current = getContainer(props);
      setMounted(true);
    }
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    container.current?.parentNode?.removeChild(container.current);
  });

  return mounted
    ? ReactDOM.createPortal(props.children, container.current)
    : null;
});

/** Sets the component's display name. */
Component.displayName = 'PortalConsumer';
