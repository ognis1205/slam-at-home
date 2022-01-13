/**
 * @fileoverview Defines {Motion} component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import * as Stage from './stage';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Ref from '../../utils/ref';
import classnames from 'classnames';

/** TODO: Refactor this fragment into function component if possible. */
class MotionFragment extends React.Component<{ children: React.ReactNode }> {
  render() {
    return this.props.children;
  }
}

/** Returns a status name according to the transition type. */
const getStatus = (name: Props.Name, status: Stage.Status): string => {
  if (!name) return null;
  if (typeof name === 'object') return name[status];
  return status;
};

/** Returns a cue name according to the transition type. */
const getCue = (cue: Stage.Cue): string => {
  if (cue === Stage.Cue.Prepare) return 'prepare';
  else if (Stage.isActiveCue(cue)) return 'active';
  else if (cue === Stage.Cue.Start) return 'start';
  else return null;
};

/** Returns a class name according to the transition type. */
const getTransition = (
  name: Props.Name,
  status: Stage.Status,
  cue: Stage.Cue
): string =>
  classnames(getStatus(name, status), getCue(cue), {
    [name as string]: typeof name === 'string',
  });

/** Configures and Returns a `Motion` component. */
const configure = (
  support: boolean
): React.ForwardRefExoticComponent<
  Props.Motion & { ref?: React.Ref<unknown> }
> => {
  /** Returns `true` if the component supports transition. */
  const transitionIsDefined = (name: Props.Name): boolean =>
    !!(name && support);

  /** Defines {Motion} components. */
  const Component = React.forwardRef<unknown, Props.Motion>(
    (
      {
        name,
        exitedClassName,
        transition = getTransition,
        visible = true,
        forceRender,
        removeOnExit = true,
        children,
        ...rest
      }: Props.Motion,
      ref: React.Ref<unknown>
    ): React.ReactElement => {
      /** Holds a reference to the react node, it may be a HTMLElement. */
      const node = React.useRef<unknown>(null);

      /** Holds a reference to the fragment fragment. */
      const fragment = React.useRef<MotionFragment>(null);

      /** Returns the DOM target element. */
      const getElement = (): HTMLElement => {
        try {
          return node.current instanceof HTMLElement
            ? node.current
            : DOM.find<HTMLElement>(fragment.current);
        } catch (e) {
          return null;
        }
      };

      /** Manages transition status by this hook. */
      const [status, cue, style, mergedVisible] = Stage.useStatus(
        transitionIsDefined(name),
        visible,
        getElement,
        rest
      );

      /** Record whether content has rendered. */
      const hasRendered = React.useRef<boolean>(mergedVisible);
      if (mergedVisible) hasRendered.current = true;

      /** Returns `true` if the motion status has been set active. */
      const isRendered = (): boolean => hasRendered.current;

      /** Forwards ref. */
      const setRef = React.useCallback((element: unknown) => {
        node.current = element;
        Ref.fill(ref, element);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      let motion: React.ReactNode;
      const context = { visible, ...rest };
      if (!children) {
        motion = null as React.ReactNode;
      } else if (status === Stage.Status.None || !transitionIsDefined(name)) {
        if (mergedVisible) {
          motion = children({ ...context }, setRef);
        } else if (!removeOnExit && isRendered()) {
          motion = children({ ...context, className: exitedClassName }, setRef);
        } else if (forceRender) {
          motion = children({ ...context, style: { display: 'none' } }, setRef);
        } else {
          motion = null;
        }
      } else {
        motion = children(
          {
            ...context,
            className: transition(name, status, cue),
            style: style,
          },
          setRef
        );
      }

      return <MotionFragment ref={fragment}>{motion}</MotionFragment>;
    }
  );

  /** Sets the component's display name. */
  Component.displayName = 'Motion';

  return Component;
};

/** Exports configured exotic compoent. */
export const Component = configure(Event.supportTransition());
