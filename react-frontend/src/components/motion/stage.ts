/**
 * @fileoverview Defines {Stage} module.
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
import * as Props from './props';
import * as Event from '../../utils/event';
import * as Hook from '../../utils/hook';

/** Defines motion cues. */
export const Cue = {
  None: 'none',
  Prepare: 'prepare',
  Start: 'start',
  Active: 'active',
  Done: 'done',
} as const;

export type Cue = typeof Cue[keyof typeof Cue];

const next = (cue: Cue): Cue => {
  switch (cue) {
    case Cue.None:
      return Cue.Prepare;
    case Cue.Prepare:
      return Cue.Start;
    case Cue.Start:
      return Cue.Active;
    case Cue.Active:
      return Cue.Done;
    case Cue.Done:
      return Cue.None;
  }
};

export const isActiveCue = (cue: Cue): boolean =>
  cue === Cue.Active || cue === Cue.Done;

/** Defines cue actions. */
const Skip = false as const;
const Next = true as const;
type Action = (cue: Cue) => Promise<void> | void | typeof Skip | typeof Next;

/** Returns motion cue and starter functions. */
const useCue = (status: Status, action: Action): [Cue, () => void] => {
  const [cue, setCue] = Hook.useMountedState<Cue>(Cue.None);
  const [nextFrame, cancelFrame] = Hook.useFrame();

  Hook.useLayoutEffect(() => {
    if (cue !== Cue.None && cue !== Cue.Done) {
      const result = action(cue);
      if (result === Skip) setCue(next(cue));
      else
        nextFrame((info) => {
          const doNext = (): void => {
            if (info.isCanceled()) return;
            setCue(next(cue));
          };
          if (result === true) doNext();
          else Promise.resolve(result).then(doNext);
        });
    }
  }, [cue, status]);

  React.useEffect(
    () => () => {
      cancelFrame();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [cue, (): void => setCue(Cue.Prepare)];
};

/** Returns event listener related functions. */
const useEventListener = (
  callback: (event: Props.Event) => void
  //): [(element: HTMLElement) => void, (element: HTMLElement) => void] => {
): ((element: HTMLElement) => void) => {
  const target = React.useRef<HTMLElement>(null);
  const handle = React.useRef<(event: Props.Event) => void>(callback);

  const handleOnce = React.useCallback((event: Props.Event) => {
    handle.current(event);
  }, []);

  const remove = (element: HTMLElement): void => {
    if (element) {
      Event.removeListener(element, Event.TRANSITION_END, handleOnce);
      Event.removeListener(element, Event.ANIMATION_END, handleOnce);
    }
  };

  const add = (element: HTMLElement): void => {
    if (target.current && target.current !== element) remove(target.current);
    if (element && element !== target.current) {
      Event.addListener(element, Event.TRANSITION_END, handleOnce);
      Event.addListener(element, Event.ANIMATION_END, handleOnce);
      target.current = element;
    }
  };

  React.useEffect(
    () => () => {
      remove(target.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  //return [add, remove];
  return add;
};

/** Defines motion status. */
export const Status = {
  None: 'none',
  Appear: 'appear',
  Enter: 'enter',
  Exit: 'exit',
} as const;

export type Status = typeof Status[keyof typeof Status];

/** Returns stage status. */
export const useStatus = (
  supportTransition: boolean,
  visible: boolean,
  getElement: () => HTMLElement,
  {
    enter = true,
    appear = true,
    exit = true,
    exitImmediately,
    deadline,
    onAppearPrepare,
    onEnterPrepare,
    onExitPrepare,
    onAppearStart,
    onEnterStart,
    onExitStart,
    onAppearActive,
    onEnterActive,
    onExitActive,
    onAppearDone,
    onEnterDone,
    onExitDone,
    onVisibleChanged,
  }: Props.Motion
): [Status, Cue, React.CSSProperties, boolean] => {
  /** @const Holds an async visibility state. */
  const [asyncVisible, setAsyncVisible] = Hook.useMountedState<boolean>();

  /** @const Holds a motion state. */
  const [status, setStatus] = Hook.useMountedState<Status>(Status.None);

  /** @const Holds a motion style state. */
  const [style, setStyle] = Hook.useMountedState<
    React.CSSProperties | undefined
  >(null);

  /** @const Holds a after-motion effect. */
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(null);

  /** @const Holds a mounted flag. */
  const hasMounted = React.useRef(false);

  /** @const Holds a unmounted flag. */
  const hasUnmounted = React.useRef(false);

  /** @const Holds a activation flag. */
  const hasActivated = React.useRef(false);

  /** Returns `true` if the component has mounted. */
  const isMounted = (): boolean => hasMounted.current;

  /** Returns `true` if the component has unmounted. */
  const isUnmounted = (): boolean => hasUnmounted.current;

  /** Returns `true` if the motion status has been set active. */
  const isActive = (): boolean => hasActivated.current;

  /** Event listener which is responsible for `Cue.Done`. */
  const handleMotionEnd = (event: Props.Event): void => {
    const element = getElement();
    if (event && !event.deadline && event.target !== element) return;

    let canBeDone: boolean | void;
    if (status === Status.Appear && isActive())
      canBeDone = onAppearDone?.(element, event);
    else if (status === Status.Enter && isActive())
      canBeDone = onEnterDone?.(element, event);
    else if (status === Status.Exit && isActive())
      canBeDone = onExitDone?.(element, event);

    if (canBeDone !== false && !isUnmounted()) {
      setStatus(Status.None);
      setStyle(null);
    }
  };

  /** Patches events to the referrenced HTML element. */
  //const [patchEvents,] = useEventListener(handleMotionEnd);
  const patchEvents = useEventListener(handleMotionEnd);

  /** Holds event handlers according to the current status. */
  const handlers = React.useMemo<{
    [Cue.Prepare]?: Props.PrepareEventHandler;
    [Cue.Start]?: Props.StartEventHandler;
    [Cue.Active]?: Props.ActiveEventHandler;
  }>(() => {
    switch (status) {
      case Status.Appear:
        return {
          [Cue.Prepare]: onAppearPrepare,
          [Cue.Start]: onAppearStart,
          [Cue.Active]: onAppearActive,
        };
      case Status.Enter:
        return {
          [Cue.Prepare]: onEnterPrepare,
          [Cue.Start]: onEnterStart,
          [Cue.Active]: onEnterActive,
        };
      case Status.Exit:
        return {
          [Cue.Prepare]: onExitPrepare,
          [Cue.Start]: onExitStart,
          [Cue.Active]: onExitActive,
        };
      default:
        return {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /** Sets the motion cue and its starter function. */
  const [cue, start] = useCue(status, (onCue) => {
    if (onCue === Cue.Prepare) {
      const onPrepare = handlers[Cue.Prepare];
      if (!onPrepare) return Skip;
      return onPrepare(getElement());
    }

    if (cue in handlers) setStyle(handlers[cue]?.(getElement(), null) || null);

    if (cue === Cue.Active) {
      patchEvents(getElement());
      if (deadline > 0) {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          handleMotionEnd({
            deadline: true,
          } as Props.Event);
        }, deadline);
      }
    }

    return Next;
  });

  /** Sets cue activation state. */
  hasActivated.current = isActiveCue(cue);

  /** `componentDidMount` */
  Hook.useDidMount(() => {
    hasMounted.current = true;
  });

  /** `componentWillUnmount` */
  Hook.useWillUnmount(() => {
    clearTimeout(timeout.current);
    hasUnmounted.current = true;
  });

  /** Starts effects when `visible` is changed. */
  Hook.useLayoutEffect(() => {
    setAsyncVisible(visible);
    if (!supportTransition) return;
    let next: Status;
    if (!isMounted() && visible && appear) next = Status.Appear;
    if (isMounted() && visible && enter) next = Status.Enter;
    if (
      (isMounted() && !visible && exit) ||
      (!isMounted() && exitImmediately && !visible && exit)
    )
      next = Status.Exit;
    if (next) {
      setStatus(next);
      start();
    }
  }, [visible]);

  /** Resets when motion changed. */
  React.useEffect(() => {
    if (
      (status === Status.Appear && !appear) ||
      (status === Status.Enter && !enter) ||
      (status === Status.Exit && !exit)
    )
      setStatus(Status.None);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appear, enter, exit]);

  /** Triggers `onVisibleChanged`. */
  React.useEffect(() => {
    if (asyncVisible !== undefined && status === Status.None)
      onVisibleChanged?.(asyncVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncVisible, status]);

  let mergedStyle = style;
  if (handlers[Cue.Prepare] && cue === Cue.Start)
    mergedStyle = {
      transition: 'none',
      ...mergedStyle,
    };

  return [status, cue, mergedStyle, asyncVisible ?? visible];
};
