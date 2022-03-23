/**
 * @fileoverview Defines Coffee component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as Props from './props';
import styles from '../../assets/styles/containers/navigation.module.scss';

/** Returns a `Button` component. */
const Button: React.FunctionComponent<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({
  children,
  target,
  href,
  ...aAttrs
}: React.AnchorHTMLAttributes<HTMLAnchorElement>): React.ReactElement => (
  <a className={styles['coffee']} {...aAttrs} target={target} href={href}>
    {children}
  </a>
);

/** Returns a `Image` component. */
const Image: React.FunctionComponent<
  React.ImgHTMLAttributes<HTMLImageElement>
> = ({
  src,
  alt,
  ...imgAttrs
}: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactElement => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className={styles['img']} {...imgAttrs} src={src} alt={alt} />
);

/** Returns a `Text` component. */
const Text: React.FunctionComponent<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  ...spanAttrs
}: React.HTMLAttributes<HTMLSpanElement>): React.ReactElement => (
  <span className={styles['text']} {...spanAttrs}>
    {children}
  </span>
);

/** Returns a `Coffee` component. */
export const Component: React.FunctionComponent<Props.Coffee> = (
  props: Props.Coffee
): React.ReactElement => (
  <Button
    {...props}
    target="_blank"
    href="https://www.buymeacoffee.com/ognis1205"
  >
    <Image
      src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
      alt="Buy me a coffee"
    />
    <Text>Buy me a coffee</Text>
  </Button>
);

/** Sets the component's display name. */
Component.displayName = 'Coffee';
