/**
 * @fileoverview Defines wrapper functions.
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
import * as Types from './types';

/** Returns a given component's dispaly name. */
const getDisplayName = (component: any): string =>
  component.displayName || component.name || "Component";

/** Wraps a React component with default properties. */
export const withDefaultProps = <Props, Defaults, Ref, Ret>(
  Component: (props: Props, ref: Ref) => Ret,
  defaults: Defaults
): (props: Types.WithDefaultProps<Props, Defaults>, ref?: Ref) => Ret => {
  function wrapper(props: Types.WithDefaultProps<Props, Defaults>, ref?: Ref): Ret {
    return Component(
      (Object.assign({}, defaults, props) as unknown) as Props,
      ref as Ref
    );
  }
  (wrapper as any).displayName = `WithDefaultProps(${getDisplayName(Component)})`;
  return wrapper;
};
