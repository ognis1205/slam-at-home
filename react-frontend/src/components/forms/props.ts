/**
 * @fileoverview Defines {Forms} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as React from 'react';
import * as Types from '../../utils/types';
import * as FontAwesome from '@fortawesome/fontawesome-svg-core';

/** A {Toggle} component properties. */
export type Toggle = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    id: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    options?: { on: string; off: string };
  }
>;

/** A {Text} component properties. */
export type Text = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    id: string;
    name: string;
    placeholder: string;
    toggleId: string;
    toggleName: string;
    checked: boolean;
    onCheck: (value: string) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    icon?: string | React.ReactNode | FontAwesome.IconProp;
    textDisabled?: boolean;
    checkDisabled?: boolean;
  }
>;

/** A {Select} options. */
export type Option = {
  value: string;
  name: string;
};

/** A {Select} component properties. */
export type Select = Types.Overwrite<
  React.HTMLAttributes<HTMLDivElement>,
  {
    id: string;
    emptyText?: string;
    onChange?: (value: string) => void;
    options?: Option[];
  }
>;

/** A {Interpolation} for {Range}. */
export type Interpolation = {
  percentage: (value: number, min: number, max: number) => number;
  clientX: (x: number, rect: DOMRect, min: number, max: number) => number;
};

/** A {Range} hook properties. */
export type Range = {
  tick: number;
  values: number[];
  min: number;
  max: number;
  step: number;
  steps: number[];
  onChange: (values: number[]) => void;
  onDrag: (values: number[]) => void;
  interpolator?: Interpolation;
};

/** A {Range} contex. */
export type RangeContext = {
  activeIndex: number;
  getTrackProps: (options: unknown) => unknown;
  ticks: {
    value: number;
    getTickProps: (options: unknown) => unknown;
  }[];
  segments: {
    value: number;
    getSegmentProps: (options: unknown) => unknown;
  }[];
  handles: {
    value: number;
    active: boolean;
    getHandleProps: (options: unknown) => unknown;
  }[];
};
