import React, { Component, Fragment } from 'react';
import { VideoItemType } from '../../types/view-model';
import styles from './video-player-experience.module.scss';

export interface VideoExperienceItemPropTypes {
  isShowLogo?: boolean;
  data: VideoItemType;
  width?: string;
  height?: string;
  videoUploaded?: boolean;
}

export class VideoPlayerExperience extends Component<VideoExperienceItemPropTypes> {
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

  constructor(props: VideoExperienceItemPropTypes) {
    super(props);
    this.videoRef = React.createRef();
  }

  handleOnclick = (e: any) => {
    e.preventDefault();
    this.setState({
      videoPlayClass: 'video-cover reveal-video'
    });
    this.videoRef.current.play();
  };

  componentWillReceiveProps(props: any) {
    const { data, backgroundImage } = props;
    if (this.videoRef && this.videoRef.current) {
      this.videoRef.current.pause();
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
      height = 'auto',
      isShowLogo,
      videoUploaded = true
    } = this.props;
    const stylesBG = {
      backgroundImage: `url(${backgroundImage})`,
      opacity: 1
    };
    return (
      <div>
        {showTitle ? <h4>{title}</h4> : null}
        {videoUploaded ? (
          <div className={videoPlayClass} style={{ height: `${height}`, width: `${width}` }}>
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
