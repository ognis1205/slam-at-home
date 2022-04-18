/**
 * @fileoverview Defines index page.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Next from 'next';
import * as Markdown from '../containers/markdown';

/** Returns a '/index' page. */
const Index: Next.NextPage = () => {
  return (
    <Markdown.Component src="https://raw.githubusercontent.com/ognis1205/slam-at-home/main/README.md" />
  );
};

export default Index;
