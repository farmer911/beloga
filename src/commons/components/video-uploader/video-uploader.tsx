import React, { Component } from 'react';
import Upload from 'rc-upload';
import styles from './video-uploader.module.scss';

interface VideoUploaderPropTypes {
  fileOptions: any;
  video: any;
  disableModal?: boolean;
}

export class VideoUploader extends Component<VideoUploaderPropTypes> {
  render() {
    const { fileOptions, video, disableModal } = this.props;
    return (
      <Upload {...fileOptions} className={styles['none-focus']} disabled={disableModal}>
        <div className={styles['border-contain']}>
          <div className="row text-center">
            <div className="col-12">
              <p className={styles['text-upload']}>Select your video</p>
              {video && video !== 'File' ? <p>{video.name}</p> : null}
            </div>
          </div>
        </div>
      </Upload>
    );
  }
}
