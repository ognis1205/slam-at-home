/**
 * @fileoverview Defines {Draggable} component.
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

/** TODO: Refactor this fragment into function component if possible. */
class Wrapper extends React.Component<{children: React.ReactNode}> {
  render() {
    return this.props.children;
  }
}

/**
 * Returns a `Draggable` component.
 * @param {Draggable} props Properties that defines a behaviour of this component.
 * @param {any} ref `ReactRef` object.
 * @return {ReactElement} A rendered React element.
 */
export const Fragment = React.forwardRef<any, Props.Draggable>((
  props: Props.Draggable,
  ref: any
): React.ReactElement => {
  /** Holds a reference to the wrapper fragment. */
  const wrapper = React.useRef<Wrapper>(null);

  return <Wrapper ref={wrapper}>{null}</Wrapper>;
});

/** Sets the component's display name. */
Fragment.displayName = 'DraggableFragment';
