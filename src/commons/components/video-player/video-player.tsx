import React, { Component, Fragment } from 'react';
import { VideoItemType } from '../../types/view-model';
import styles from './video-player.module.scss';
import { videoConfig } from '../../constants/video.conf';
export interface VideoItemPropTypes {
  isShowLogo?: boolean;
  data: VideoItemType;
  width?: string;
  height?: string;
  videoUploaded?: boolean;
  isResetVideo?: boolean;
  closeVideo?: boolean;
}

export class VideoPlayer extends Component<VideoItemPropTypes> {
  videoRef: any;
  state = {
    videoPlayClass: 'video-cover',
    stylesFromParent: {
      backgroundImage: '',
      opacity: 1
    }
  };

  // stylesFromParent = {
  //   backgroundImage: `url(${this.props.data.backgroundImage})`,
  //   opacity: 1
  // };

  constructor(props: VideoItemPropTypes) {
    super(props);
    this.videoRef = React.createRef();
  }

  handleOnclick = (e: any) => {
    e.preventDefault();
    const { data } = this.props;
    if (data.isDefaultVideo) {
      this.setState({
        videoPlayClass: 'video-cover reveal-video default-video'
      });
    } else {
      this.setState({
        videoPlayClass: 'video-cover reveal-video'
      });
    }

    this.videoRef.current.play();
  };

  componentWillReceiveProps(props: any) {
    const { data, backgroundImage, isResetVideo = false, closeVideo = false } = props;
    if (this.videoRef && this.videoRef.current && isResetVideo) {
      this.videoRef.current.pause();
      this.videoRef.current.currentTime = 0;
      this.setState({
        videoPlayClass: 'video-cover'
      });
    }
    if (this.videoRef && this.videoRef.current && closeVideo) {
      this.videoRef.current.pause();
      this.videoRef.current.currentTime = 0;
      this.setState({
        videoPlayClass: 'video-cover'
      });
    }
  }

  componentWillMount() {
    const { data } = this.props;
    this.setState({
      stylesFromParent: {
        backgroundImage: `url(${data.backgroundImage})`,
        opacity: 1
      }
    });
  }

  onEndVideo = () => {
    if (this.videoRef && this.videoRef.current) {
      setTimeout(() => {
        this.setState({
          videoPlayClass: 'video-cover'
        });
      }, 1000);
    }
  };

  render() {
    const { videoPlayClass, stylesFromParent } = this.state;
    const {
      data: { title, videoSource, showTitle, backgroundImage },
      width = '100%',
      // height = videoConfig.height,
      isShowLogo = false,
      videoUploaded = true
    } = this.props;
    const height = videoConfig.height;
    const stylesBG = {
      backgroundImage: `url(${backgroundImage})`,
      opacity: 1
    };
    return (
      <div>
        {showTitle ? <h4>{title}</h4> : null}
        {videoUploaded ? (
          <div className={videoPlayClass} style={{ maxHeight: `${height}`, width: `${width}` }}>
            {backgroundImage ? (
              <div style={stylesBG} className="background-image-holder">
                <img src={backgroundImage} />
              </div>
            ) : (
              <div className="no-preview-video">
                <div className="no-preview-inner">
                  <img src="/images/logo-big.png" />
                  <span>The Video Resume</span>
                </div>
              </div>
            )}
            <div className="video-play-icon video-play-icon--custom" onClick={this.handleOnclick} />
            <video
              ref={this.videoRef}
              height={height}
              style={{ height: 'auto', maxHeight: videoConfig.height }}
              controlsList="nodownload"
              controls
              src={videoSource}
              onEnded={this.onEndVideo}
            >
              {videoSource ? <source src={videoSource} type={`video/*`} /> : null}
              Your browser does not support HTML5 video.
            </video>
            {isShowLogo ? (
              <div className="logo-beloga">
                <img className="logo-video" alt="logo" src="/images/logo-big.png" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="no-preview-video">
            <div className="no-preview-inner">
              <img src="/images/logo-big.png" />
              <span>The Video Resume</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}
