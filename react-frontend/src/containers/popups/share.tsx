/**
 * @fileoverview Defines Share component.
 * @copyright Shingo OKAWA 2022
 */
import * as React from 'react';
import * as Window from './window';
import * as ReactShare from 'react-share';
import styles from '../../assets/styles/containers/popups.module.scss';

/** Returns a `Share` component. */
export const Component: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void;
  }
> = ({
  onClose,
  ...windowProps
}: React.HTMLAttributes<HTMLDivElement> & {
  onClose?: () => void;
}): React.ReactElement => (
  <Window.Component
    {...windowProps}
    className={styles['share']}
    type="share"
    title="Share this app"
    onClose={onClose}
  >
    <div className={styles['comment']}>Share with</div>
    <div className={styles['scroll']}>
      <div className={styles['social']}>
        <ReactShare.TwitterShareButton
          url="https://github.com/ognis1205/slam-at-home"
          title="Check out this awesome app I found"
          className={styles['share-button']}
        >
          <ReactShare.TwitterIcon size={64} round />
        </ReactShare.TwitterShareButton>
        <div className={styles['social-name']}>Twitter</div>
      </div>
      <div className={styles['social']}>
        <ReactShare.LinkedinShareButton
          url="https://github.com/ognis1205/slam-at-home"
          title="Check out this awesome app I found"
          className={styles['share-button']}
        >
          <ReactShare.LinkedinIcon size={64} round />
        </ReactShare.LinkedinShareButton>
        <div className={styles['social-name']}>Linkedin</div>
      </div>
      <div className={styles['social']}>
        <ReactShare.FacebookShareButton
          url="https://github.com/ognis1205/slam-at-home"
          title="Check out this awesome app I found"
          className={styles['share-button']}
        >
          <ReactShare.FacebookIcon size={64} round />
        </ReactShare.FacebookShareButton>
        <div className={styles['social-name']}>Facebook</div>
      </div>
      <div className={styles['social']}>
        <ReactShare.RedditShareButton
          url="https://github.com/ognis1205/slam-at-home"
          title="Check out this awesome app I found"
          className={styles['share-button']}
        >
          <ReactShare.RedditIcon size={64} round />
        </ReactShare.RedditShareButton>
        <div className={styles['social-name']}>Reddit</div>
      </div>
      <div className={styles['social']}>
        <ReactShare.HatenaShareButton
          url="https://github.com/ognis1205/slam-at-home"
          title="Check out this awesome app I found"
          className={styles['share-button']}
        >
          <ReactShare.HatenaIcon size={64} round />
        </ReactShare.HatenaShareButton>
        <div className={styles['social-name']}>Hatena</div>
      </div>
    </div>
  </Window.Component>
);

/** Sets the component's display name. */
Component.displayName = 'Share';
