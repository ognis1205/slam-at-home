/**
 * @fileoverview
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as NextDocument from 'next/document';
import Document from 'next/document';

/**
 *
 */
export default class SLAMDocument extends Document {
  static async getInitialProps(
    ctx: NextDocument.DocumentContext
  ): Promise<NextDocument.DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [...React.Children.toArray(initialProps.styles)],
    };
  }

  render(): React.ReactElement {
    return (
      <NextDocument.Html lang="en">
        <NextDocument.Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </NextDocument.Head>
        <body>
          <NextDocument.Main />
          <NextDocument.NextScript />
        </body>
      </NextDocument.Html>
    );
  }
}
