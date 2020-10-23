import * as React from 'react';
import styles from './video-list-item.module.scss';
import { VideoPlayer } from '../../video-player/video-player';
import { VideoType } from '../../../types/view-model';

interface VideoListItemPropTypes {
  data: VideoType;
  height: string;
}
export const VideoListItem = (props: VideoListItemPropTypes) => {
  const {
    height,
    data: { videoItem, postTitle, postDetail }
  } = props;
  return (
    <div className={`row`}>
      <div className="col-7">
        <VideoPlayer data={videoItem} height={height} />
      </div>
      <div className={`${styles['contain']} col-5`}>
        <h4 className={styles['fix-text']}>{postTitle}</h4>
        <h5 className={styles['fix-text']}>MorePost</h5>
        <p className={`${styles['fix-text']} ${styles['detail']}`}>{postDetail}</p>
        <a className={`${styles['fix-text']} ${styles['detail']}`}>
          See more <i className="stack-right-open" />
        </a>
      </div>
    </div>
  );
};
