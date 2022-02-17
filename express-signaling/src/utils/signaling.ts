/**
 * @fileoverview Defines logger class.
 * @copyright Shingo OKAWA 2022
 */

/* Signal data format. */
export type Signal = {
  from: string;
  to: string;
  type: string;
  payload: string;
};

/* Validate this value with a custom type guard. */
export const isValid = (value: any): value is Signal =>
  'from' in value && 'to' in value && 'type' in value && 'payload' in value;
