/**
 * @fileoverview Defines wrapper functions.
 * @copyright Shingo OKAWA 2021
 */
import * as Types from './types';

/** Returns a given component's dispaly name. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDisplayName = (component: any): string =>
  component.displayName || component.name || 'Component';

/** Wraps a React component with default properties. */
export const withDefaultProps = <Props, Defaults, Ref, Ret>(
  Component: (props: Props, ref: Ref) => Ret,
  defaults: Defaults
): ((props: Types.WithDefaultProps<Props, Defaults>, ref?: Ref) => Ret) => {
  function wrapper(
    props: Types.WithDefaultProps<Props, Defaults>,
    ref?: Ref
  ): Ret {
    return Component(
      Object.assign({}, defaults, props) as unknown as Props,
      ref as Ref
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (wrapper as any).displayName = `WithDefaultProps(${getDisplayName(
    Component
  )})`;
  return wrapper;
};
