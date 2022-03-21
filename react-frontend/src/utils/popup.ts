/**
 * @fileoverview Defines DOM position helper functions.
 * @copyright Shingo OKAWA 2022
 */
import * as DOM from './dom';

/** A type union of popup positions. */
export type Position =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'center center';

/** General purpose 2-D positions. */
export type CSSCoord = {
  top: number | string;
  left: number | string;
  transform: string;
  arrowLeft: number | string;
  arrowTop: number | string;
};

/** Defines HTML bounds. */
export type Bounds = {
  top: number | string;
  left: number | string;
  width: number | string;
  height: number | string;
};

/** Computes CSS coordinate for a given position. */
export const getCSSCoord = (
  triggerBounding: DOMRect,
  contentBounding: DOMRect,
  position: Position,
  offset: { x: number; y: number },
  arrow: boolean
): CSSCoord => {
  const args = position.split(/\s+/);
  const margin = arrow ? 8 : 0;

  const centerTop = triggerBounding.top + triggerBounding.height / 2;
  const centerLeft = triggerBounding.left + triggerBounding.width / 2;
  const { height, width } = contentBounding;
  let top = centerTop - height / 2;
  let left = centerLeft - width / 2;
  let transform = '';
  let arrowTop = '0%';
  let arrowLeft = '0%';

  switch (args[0]) {
    case 'top':
      top -= height / 2 + triggerBounding.height / 2 + margin;
      transform = `rotate(180deg)  translateX(50%)`;
      arrowTop = '100%';
      arrowLeft = '50%';
      break;
    case 'bottom':
      top += height / 2 + triggerBounding.height / 2 + margin;
      transform = `rotate(0deg) translateY(-100%) translateX(-50%)`;
      arrowLeft = '50%';
      break;
    case 'left':
      left -= width / 2 + triggerBounding.width / 2 + margin;
      transform = ` rotate(90deg)  translateY(50%) translateX(-25%)`;
      arrowLeft = '100%';
      arrowTop = '50%';
      break;
    case 'right':
      left += width / 2 + triggerBounding.width / 2 + margin;
      transform = `rotate(-90deg)  translateY(-150%) translateX(25%)`;
      arrowTop = '50%';
      break;
    default:
  }

  switch (args[1]) {
    case 'top':
      top = triggerBounding.top;
      arrowTop = `${triggerBounding.height / 2}px`;
      break;
    case 'bottom':
      top = triggerBounding.top - height + triggerBounding.height;
      arrowTop = `${height - triggerBounding.height / 2}px`;
      break;
    case 'left':
      left = triggerBounding.left;
      arrowLeft = `${triggerBounding.width / 2}px`;
      break;
    case 'right':
      left = triggerBounding.left - width + triggerBounding.width;
      arrowLeft = `${width - triggerBounding.width / 2}px`;
      break;
    default:
  }

  top = args[0] === 'top' ? top - offset.y : top + offset.y;
  left = args[0] === 'left' ? left - offset.x : left + offset.x;

  return { top, left, transform, arrowLeft, arrowTop };
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
  triggerBounding: DOMRect,
  contentBounding: DOMRect,
  position: Position | Position[],
  offset: { x: number; y: number },
  arrow: boolean,
  keepTooltipInside: string | boolean
): CSSCoord => {
  let best: CSSCoord = {
    arrowLeft: '0%',
    arrowTop: '0%',
    left: 0,
    top: 0,
    transform: 'rotate(135deg)',
  };

  let i = 0;
  const wrapperBox = getTooltipBoundary(keepTooltipInside);
  let positions = Array.isArray(position) ? position : [position];

  if (keepTooltipInside || Array.isArray(position))
    positions = [...positions, ...POSITION_TYPES];

  while (i < positions.length) {
    best = getCoordinatesForPosition(
      triggerBounding,
      contentBounding,
      positions[i],
      offset,
      arrow
    );

    const box = {
      top: best.top,
      left: best.left,
      width: contentBounding.width,
      height: contentBounding.height,
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
