/**
 * @fileoverview Defines Markdown component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Props from './props';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css/github-markdown.css';

/** Returns a `Container` component. */
export const Container: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = ({
  children,
  ...divProps
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => (
  <div {...divProps}>{children}</div>
);

/** Sets the component's display name. */
Container.displayName = 'Container';

/** Returns the class name. */
const getClassName = (className: string): string =>
  classnames('markdown-body', {
    [className || '']: !!className,
  });

/** Returns a `Markdown` component. */
export const Component: React.FunctionComponent<Props.Markdown> = ({
  src,
  className,
  ...divProps
}: Props.Markdown): React.ReactElement => {
  /** @const Holds the markdown. */
  const [markdown, setMarkdown] = React.useState<string>('');

  /** Loads external md file.*/
  React.useEffect(() => {
    fetch(src)
      .then((response) => {
        if (response.ok) return response.text();
        else return Promise.reject('failed to fetch text correctly');
      })
      .then((text) => {
        setMarkdown(text);
      })
      .catch((error) => console.error(error));
  });

  return (
    <Container {...divProps} className={getClassName(className)}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
    </Container>
  );
};

/** Sets the component's display name. */
Component.displayName = 'Markdown';
