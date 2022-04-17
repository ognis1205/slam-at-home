/**
 * @fileoverview Defines Range hook.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import * as DOM from '../../utils/dom';
import * as Event from '../../utils/event';
import * as Hook from '../../utils/hook';
import * as Misc from '../../utils/misc';

/** Default interpolation for {Range}. */
const DefaultInterpolation: Props.Interpolation = {
  percentage: (value: number, min: number, max: number): number => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  },
  clientX: (x: number, rect: DOMRect, min: number, max: number): number => {
    const { left, width } = rect;
    const percentage = (x - left) / width;
    const value = (max - min) * percentage;
    return value + min;
  },
};

/** A {Range} hook. */
export const useRange = ({
  tick,
  values,
  min,
  max,
  step,
  steps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (values: number[]) => {
    // Do nothing.
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDrag = (values: number[]) => {
    // Do nothing.
  },
  interpolator = DefaultInterpolation,
}: Props.Range): Props.RangeContext => {
  /** Holds the current index of the range. */
  const [activeIndex, setActiveIndex] = React.useState<number>(null);

  /** Holds a inactive values. */
  const [inactiveValues, setInactiveValues] = React.useState<number[]>(null);

  /** Holds a reference to the tracker element. */
  const track = React.useRef<HTMLElement>(null);

  /** Holds a latest state values. */
  const getLatest = Hook.useLatest({
    activeIndex,
    values,
    inactiveValues,
    onChange,
    onDrag,
  });

  /** Computes client x value for the slider. */
  const getValueForClientX = React.useCallback(
    (x: number) => {
      const rect = DOM.getBoundingClientRect(track.current);
      return interpolator.clientX(x, rect, min, max);
    },
    [interpolator, max, min]
  );

  /** Computes client percentage for the slider. */
  const getPercentageForValue = React.useCallback(
    (value: number) => interpolator.percentage(value, min, max),
    [interpolator, max, min]
  );

  /** Returns the next value of the range. */
  const getNext = React.useCallback(
    (value: number, direction: number) => {
      if (steps) {
        const nextIndex = steps.indexOf(value) + direction;
        if (nextIndex >= 0 && nextIndex < steps.length) return steps[nextIndex];
        else return value;
      } else {
        const nextValue = value + step * direction;
        if (nextValue >= min && nextValue <= max) return nextValue;
        else return value;
      }
    },
    [max, min, step, steps]
  );

  /** Rounds up the given value to one of the steps. */
  const toRound = React.useCallback(
    (value: number) => {
      let l = min;
      let r = max;
      if (steps) {
        steps.forEach((step: number) => {
          if (step <= value && step > l) l = step;
          if (step >= value && step < r) r = step;
        });
      } else {
        while (l < value && l + step < value) l += step;
        r = Math.min(l + step, max);
      }
      if (value - l < r - value) return l;
      else return r;
    },
    [max, min, step, steps]
  );

  /** An event handler called on `drag` events. */
  const handleDrag = React.useCallback(
    (e: Event.MouseTouch) => {
      const { activeIndex, onChange } = getLatest();
      const clientX =
        e.type === 'touchmove' ? e.changedTouches[0].clientX : e.clientX;
      const value = getValueForClientX(clientX);
      const rounded = toRound(value);
      const newValues = [
        ...values.slice(0, activeIndex),
        rounded,
        ...values.slice(activeIndex + 1),
      ];
      const sortedValues = Misc.sort(newValues);
      onChange(sortedValues);
    },
    [getLatest, getValueForClientX, toRound, values]
  );

  /** An event handler called on `keydown` events. */
  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent, i: number) => {
      const { values, onChange } = getLatest();
      // Left Arrow || Right Arrow
      if (e.keyCode === 37 || e.keyCode === 39) {
        setActiveIndex(i);
        const direction = e.keyCode === 37 ? -1 : 1;
        const newValue = getNext(values[i], direction);
        const newValues = [
          ...values.slice(0, i),
          newValue,
          ...values.slice(i + 1),
        ];
        const sortedValues = Misc.sort(newValues);
        onChange(sortedValues);
      }
    },
    [getLatest, getNext]
  );

  /** An event handler called on `keypress` events. */
  const handlePress = React.useCallback(
    (e: MouseEvent, i: number) => {
      setActiveIndex(i);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleRelease = (e: KeyboardEvent) => {
        const { inactiveValues, values, onChange, onDrag } = getLatest();
        Event.removeListener(document, 'mousemove', handleDrag);
        Event.removeListener(document, 'touchmove', handleDrag);
        Event.removeListener(document, 'mouseup', handleRelease);
        Event.removeListener(document, 'touchend', handleRelease);
        const sorted = Misc.sort(inactiveValues || values);
        onChange(sorted);
        onDrag(sorted);
        setActiveIndex(null);
        setInactiveValues(null);
      };
      Event.addListener(document, 'mousemove', handleDrag);
      Event.addListener(document, 'touchmove', handleDrag);
      Event.addListener(document, 'mouseup', handleRelease);
      Event.addListener(document, 'touchend', handleRelease);
    },
    [getLatest, handleDrag]
  );

  /** Builds the ticks to be returned. */
  const ticks = React.useMemo(() => {
    let ticks = steps;
    if (!ticks) {
      ticks = [min];
      while (ticks[ticks.length - 1] < max - tick)
        ticks.push(ticks[ticks.length - 1] + tick);
      ticks.push(max);
    }
    return ticks.map((value: number, i: number) => ({
      value,
      getTickProps: ({ key = i, style = {}, ...rest } = {}) => ({
        key,
        style: {
          position: 'absolute',
          width: 0,
          left: `${getPercentageForValue(value)}%`,
          transform: `translateX(-50%)`,
          ...style,
        },
        ...rest,
      }),
    }));
  }, [getPercentageForValue, max, min, steps, tick]);

  /** Builds the segments to be returned. */
  const segments = React.useMemo(() => {
    const sorted = Misc.sort(inactiveValues || values);
    return [...sorted, max].map((value: number, i: number) => ({
      value,
      getSegmentProps: ({ key = i, style = {}, ...rest } = {}) => {
        const left = getPercentageForValue(sorted[i - 1] ? sorted[i - 1] : min);
        const width = getPercentageForValue(value) - left;
        return {
          key,
          style: {
            position: 'absolute',
            left: `${left}%`,
            width: `${width}%`,
            ...style,
          },
          ...rest,
        };
      },
    }));
  }, [getPercentageForValue, max, min, inactiveValues, values]);

  /** Builds the handles to be returned. */
  const handles = React.useMemo(
    () =>
      (inactiveValues || values).map((value: number, i: number) => ({
        value,
        active: i === activeIndex,
        getHandleProps: ({
          key = i,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onKeyDown = (e: KeyboardEvent) => {
            // Do nothing.
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onMouseDown = (e: MouseEvent) => {
            // Do nothing.
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onTouchStart = (e: Event.MouseTouch) => {
            // Do nothing.
          },
          style = {},
          ...rest
        } = {}) => ({
          key,
          onKeyDown: (e: KeyboardEvent) => {
            handleKeyDown(e, i);
            if (onKeyDown) onKeyDown(e);
          },
          onMouseDown: (e: MouseEvent) => {
            handlePress(e, i);
            if (onMouseDown) onMouseDown(e);
          },
          onTouchStart: (e: Event.MouseTouch) => {
            handlePress(e, i);
            if (onTouchStart) onTouchStart(e);
          },
          role: 'slider',
          'aria-valuemin': min,
          'aria-valuemax': max,
          'aria-valuenow': value,
          style: {
            position: 'absolute',
            top: '50%',
            left: `${getPercentageForValue(value)}%`,
            zIndex: i === activeIndex ? '1' : '0',
            transform: 'translate(-50%, -50%)',
            ...style,
          },
          ...rest,
        }),
      })),
    [
      activeIndex,
      getPercentageForValue,
      handleKeyDown,
      handlePress,
      min,
      max,
      inactiveValues,
      values,
    ]
  );

  /** Builds the track props to be returned. */
  const getTrackProps = ({ style = {}, ref = null, ...rest } = {}) => {
    return {
      ref: (elem: HTMLElement) => {
        track.current = elem;
        if (ref) {
          if (typeof ref === 'function') ref(elem);
          else ref.current = elem;
        }
      },
      style: {
        position: 'relative',
        userSelect: 'none',
        ...style,
      },
      ...rest,
    };
  };

  return {
    activeIndex,
    getTrackProps,
    ticks,
    segments,
    handles,
  };
};
