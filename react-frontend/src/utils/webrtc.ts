/**
 * @fileoverview Defines WebRTC helper functions.
 * @copyright Shingo OKAWA 2022
 */

/** A type union of peer connection  */
export const SignalState = {
  OFFER: 'offer',
  ANSWER: 'answer',
} as const;

export type SignalState = typeof SignalState[keyof typeof SignalState];
