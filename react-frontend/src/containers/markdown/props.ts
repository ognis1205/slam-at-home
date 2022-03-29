/**
 * @fileoverview Defines {Markdown} properties.
 * @copyright Shingo OKAWA 2022
 */
import type * as Types from '../../utils/types';
import ReactMarkdown from 'react-markdown';

/** A {Markdown} component properties. */
export type ExternalLink = Types.Overwrite<
  ReactMarkdown.ReactMarkdownProps,
  {
    src: string;
  }
>;
