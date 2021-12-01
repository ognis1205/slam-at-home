/**
 * @fileoverview Defines scrolling helper classes/functions.
 */

/** Removes optional keys from a given type. */
type NonOptionalKeys<T> = {
  [K in keyof T]-?: {} extends { [K1 in K]: T[K] } ? never : K;
}[keyof T];

/** Properties without default values. */
type NonDefaultProps<Props, Defaults> =
  Pick<Props, Exclude<keyof Props, NonOptionalKeys<Defaults>>>;

/** Properties with default values. */
type OptionalProps<Defaults> =
  { [P in NonOptionalKeys<Defaults>]?: Defaults[P] };

/** Wrapped properties with default values. */
type WithDefaultProps<Props, Defaults> =
  NonDefaultProps<Props, Defaults> & OptionalProps<Defaults>;

/** Returns a given component's dispaly name. */
const getDisplayName = (component: any): string =>
  component.displayName || component.name || "Component";

/** Wraps a React component with default properties. */
export const withDefaultProps = <Props, Defaults, Ref, Ret>(
  Component: (props: Props, ref: Ref) => Ret,
  defaults: Defaults
): (props: WithDefaultProps<Props, Defaults>, ref?: Ref) => Ret => {
  function wrapper(props: WithDefaultProps<Props, Defaults>, ref?: Ref): Ret {
    const np = (Object.assign({}, defaults, props) as unknown) as Props;
    return Component(np, ref as Ref);
  }
  (wrapper as any).displayName = `WithDefaultProps(${getDisplayName(Component)})`;
  return wrapper;
};

