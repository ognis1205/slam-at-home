/**
 * @fileoverview Defines DOM position helper functions.
 * @copyright Shingo OKAWA 2022
 */
import * as DOM from './dom';

/** A type union of popup positions. */
const POSITIONS = [
  'top left',
  'top center',
  'top right',
  'right top',
  'right center',
  'right bottom',
  'bottom left',
  'bottom center',
  'bottom right',
  'left top',
  'left center',
  'left bottom',
  'center center',
] as const;

export type Position = typeof POSITIONS[number];

/** General purpose 2-D positions. */
export type CSSCoord = {
  top: number;
  left: number;
  transform: string;
};

/** Defines HTML bounds. */
export type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

/** Computes CSS coordinate for a given position. */
export const getCSSCoord = (
  triggerRect: DOMRect,
  contentRect: DOMRect,
  position: Position,
  offset: { x: number; y: number }
): CSSCoord => {
  const args = position.split(/\s+/);
  const centerTop = triggerRect.top + triggerRect.height / 2;
  const centerLeft = triggerRect.left + triggerRect.width / 2;
  const { height, width } = contentRect;
  let top = centerTop - height / 2;
  let left = centerLeft - width / 2;
  let transform = '';

  switch (args[0]) {
    case 'top':
      top -= height / 2 + triggerRect.height / 2;
      transform = `rotate(180deg)  translateX(50%)`;
      break;
    case 'bottom':
      top += height / 2 + triggerRect.height / 2;
      transform = `rotate(0deg) translateY(-100%) translateX(-50%)`;
      break;
    case 'left':
      left -= width / 2 + triggerRect.width / 2;
      transform = ` rotate(90deg)  translateY(50%) translateX(-25%)`;
      break;
    case 'right':
      left += width / 2 + triggerRect.width / 2;
      transform = `rotate(-90deg)  translateY(-150%) translateX(25%)`;
      break;
    default:
  }

  switch (args[1]) {
    case 'top':
      top = triggerRect.top;
      break;
    case 'bottom':
      top = triggerRect.top - height + triggerRect.height;
      break;
    case 'left':
      left = triggerRect.left;
      break;
    case 'right':
      left = triggerRect.left - width + triggerRect.width;
      break;
    default:
  }

  top = args[0] === 'top' ? top - offset.y : top + offset.y;
  left = args[0] === 'left' ? left - offset.x : left + offset.x;

  return { top, left, transform };
};

/** Computes tooltip boundary. */
export const getTooltipBounds = (
  keepTooltipInside: string | boolean
): Bounds => {
  if (!DOM.isDefined()) return undefined;
  let box = {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  if (typeof keepTooltipInside === 'string') {
    const selector = document.querySelector(keepTooltipInside);
    if (selector === null) return undefined;
    else box = selector.getBoundingClientRect();
  }
  return box;
};

/** Computes CSS coordinate for a given position. */
export const getPosition = (
  triggerRect: DOMRect,
  contentRect: DOMRect,
  position: Position | Position[],
  offset: { x: number; y: number },
  keepTooltipInside: string | boolean
): CSSCoord => {
  let best: CSSCoord = {
    left: 0,
    top: 0,
    transform: 'rotate(135deg)',
  };

  let i = 0;
  const wrapperBox = getTooltipBounds(keepTooltipInside);
  let positions = Array.isArray(position) ? position : [position];

  if (keepTooltipInside || Array.isArray(position))
    positions = [...positions, ...POSITIONS];

  while (i < positions.length) {
    best = getCSSCoord(triggerRect, contentRect, positions[i], offset);

    const box = {
      top: best.top,
      left: best.left,
      width: contentRect.width,
      height: contentRect.height,
    };

    if (
      box.top <= wrapperBox.top ||
      box.left <= wrapperBox.left ||
      box.top + box.height >= wrapperBox.top + wrapperBox.height ||
      box.left + box.width >= wrapperBox.left + wrapperBox.width
    )
      i++;
    else break;
  }

  return best;
};
