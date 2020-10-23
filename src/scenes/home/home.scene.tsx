import './home.scene.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Iframe from 'react-iframe';

import styles from './home.scene.module.scss';
import { selectAuthState } from '../../ducks/auth.duck';
import { RoutePaths } from '../../commons/constants';
import { getUserInfoAction, selectUserInfo } from '../../ducks/user.duck';

import { VideoPlayer, Modal, LoadingIcon } from '../../commons/components';

import { loadingWithConfig } from '../../HOCs';
import ScrollDownArrow from '../../commons/components/scroll-down-arrow/scroll-down-arrow';
import { setTimeout } from 'timers';
import { NavLink } from 'react-router-dom';
const DefaultLoading = loadingWithConfig(LoadingIcon);

interface HomeSceneProps {
  userInfo?: any;
  logoutAction: any;
  isAuthenticated: boolean;
  checkValidUsernameAction: any;
  history: any;
  locaiton: any;

  document: any;
  getUserInfoAction: any;
}

const APP_URI = process.env.REACT_APP_URI;

class HomeScene extends Component<HomeSceneProps> {
  videoRef: any;

  state = {
    showViewVideoIntroduction: false,
    dataPreviewIntroduction: {
      title: 'View video',
      videoSource: APP_URI + '/videos/home/home-bg-full.mp4',
      showTitle: false,
      backgroundImage: APP_URI + '/images/home/matt-poster.png'
    },
    random: 0,
    showExampleFirst: false,
    showExampleSecond: false,
    showExampleThird: false,
    showAnaVideo: false,
    showInspireVideo: false,
    dataAnaVideo: {
      title: 'View video',
      videoSource: APP_URI + '/videos/home/Ava_s_Video.mp4',
      showTitle: false,
      backgroundImage: APP_URI + '/images/home/Ana.png'
    },
    dataInspireVideo: {
      title: 'View video',
      videoSource: APP_URI + '/videos/home/Inspire_Your_Resume.mp4',
      showTitle: false,
      backgroundImage: APP_URI + '/images/home/Inspire.png'
    }
  };

  constructor(props: HomeSceneProps) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentWillMount() {
    const { history, userInfo, getUserInfoAction, isAuthenticated } = this.props;
    getUserInfoAction();
    if (userInfo && !userInfo.submitted) {
      const validPathname = RoutePaths.USER_PROFILE.getPath(userInfo.username);
      history.push(validPathname);
    }

    document.body.classList.add('home-scene');
    if (this.videoRef && this.videoRef.current) {
      this.videoRef.current.play();
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('home-scene');
    if (this.videoRef && this.videoRef.current) {
      this.videoRef.current.pause();
    }
  }

  componentWillUpdate(nextProps: any) {
    const { history, userInfo } = nextProps;
    if (userInfo && !userInfo.submitted) {
      const validPathname = RoutePaths.USER_PROFILE.getPath(userInfo.username);
      history.push(validPathname);
    }
  }

  toggleViewVideoIntroduction = () => {
    this.setState({
      showViewVideoIntroduction: !this.state.showViewVideoIntroduction,
      random: this.state.random + 1
    });
    if (this.state.showViewVideoIntroduction) {
      this.videoRef.current.play();
    } else {
      this.videoRef.current.pause();
    }
  };
  toggleViewAnaVideo = () => {
    this.setState({
      random: this.state.random + 1,
      showAnaVideo: !this.state.showAnaVideo
    });
  };
  toggleViewInspireVideo = () => {
    this.setState({
      random: this.state.random + 1,
      showInspireVideo: !this.state.showInspireVideo
    });
  };

  toggleShowExampleFirst = () => {
    this.setState({
      random: this.state.random + 1,
      showExampleFirst: !this.state.showExampleFirst
    });
  };

  toggleShowExampleSecond = () => {
    this.setState({
      random: this.state.random + 1,
      showExampleSecond: !this.state.showExampleSecond
    });
  };

  toggleShowExampleThird = () => {
    this.setState({
      random: this.state.random + 1,
      showExampleThird: !this.state.showExampleThird
    });
  };

  render() {
    const {
      showViewVideoIntroduction,
      dataPreviewIntroduction,
      dataAnaVideo,
      dataInspireVideo,
      showExampleFirst,
      showExampleSecond,
      showExampleThird,
      showAnaVideo,
      showInspireVideo
    } = this.state;
    const { isAuthenticated, userInfo } = this.props;
    const homeUrl = `${process.env.REACT_APP_BLOG_BASE_URL}`;
    let description =
      'Brainstorm ideas for your 30-second introduction video, including a highlight reel of your education, work experience, and skills.';
    let title = 'Belooga &#8211; The First Video Resume Job Board Platform';
    let keywords = 'Belooga, Resume, Video, Resume Video, Job';
    let Anna =  APP_URI + '/images/home/Ana.png';
    let inspire = APP_URI + '/images/home/Inspire.png';

    return isAuthenticated && userInfo && !userInfo.submitted ? (
      DefaultLoading
    ) : (
      <div className="home-page">
        <Modal
          isOpen={showViewVideoIntroduction}
          toggleModal={this.toggleViewVideoIntroduction}
          className="view-video-modal"
        >
          {/* <VideoPlayer isShowLogo={true} data={dataPreviewIntroduction} height="auto" /> */}
          <Iframe
            key={this.state.random}
            url="https://www.youtube.com/embed/BXamYc1UyHY"
            width="100%"
            height="auto"
            className="example-video-iframe"
            display="initial"
            position="relative"
            allowFullScreen
          />
        </Modal>
        <Modal
          isOpen={showAnaVideo}
          toggleModal={this.toggleViewAnaVideo}
          className="view-video-modal"
        >
          <Iframe
            key={this.state.random}
            url="https://www.youtube.com/embed/VxWP_cdpfSA"
            width="100%"
            height="auto"
            className="example-video-iframe"
            display="initial"
            position="relative"
            allowFullScreen
          />
        </Modal>
        <Modal
          isOpen={showInspireVideo}
          toggleModal={this.toggleViewInspireVideo}
          className="view-video-modal"
        >
          <Iframe
            key={this.state.random}
            url="https://www.youtube.com/embed/1PpeEnQ1CAM"
            width="100%"
            height="auto"
            className="example-video-iframe"
            display="initial"
            position="relative"
            allowFullScreen
          />
        </Modal>
        <Modal isOpen={showExampleFirst} toggleModal={this.toggleShowExampleFirst} className="view-video-modal">
          <Iframe
            key={this.state.random}
            url="https://www.youtube.com/embed/minaaAP8Oo0?feature=oembed"
            width="100%"
            height="auto"
            className="example-video-iframe"
            display="initial"
            position="relative"
            allowFullScreen
          />
        </Modal>
        <Modal isOpen={showExampleSecond} toggleModal={this.toggleShowExampleSecond} className="view-video-modal">
          <Iframe
            key={this.state.random}
            url="https://www.youtube.com/embed/S3o6fNAYlaE?feature=oembed"
            width="100%"
            height="auto"
            className="example-video-iframe"
            display="initial"
            position="relative"
            allowFullScreen
          />
        </Modal>
        <Modal isOpen={showExampleThird} toggleModal={this.toggleShowExampleThird} className="view-video-modal">
          <Iframe
            key={this.state.random}
            url="https://www.youtube.com/embed/NgIpeC800lc?feature=oembed"
            width="100%"
            height="auto"
            className="example-video-iframe"
            display="initial"
            position="relative"
            allowFullScreen
          />
        </Modal>
        <section
          id="video-intro-id"
          className="cover imagebg videobg height-100 text-center video-active cover-section"
          data-overlay="4"
        >
          <video
            ref={this.videoRef}
            controlsList="nodownload"
            autoPlay
            loop
            muted
            src={`${APP_URI}/videos/home/home-bg.mp4`}
          >
            <source src={`${APP_URI}/videos/home/home-bg.mp4`} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
          <div
            className="background-image-holder"
            style={{
              backgroundImage: `url("${this.state.dataPreviewIntroduction.backgroundImage}")`,
              opacity: 1
            }}
          >
            <img alt="image" src={this.state.dataPreviewIntroduction.backgroundImage} />
          </div>
          <div className="container pos-vertical-center text-holder">
            <div className="row">
              <div className="col-md-12">
                <h1>Belooga is the First and Only Video Resume Platform</h1>
                <div className="modal-instance block">
                  <div
                    className="video-play-icon modal-trigger"
                    data-modal-index="0"
                    onClick={this.toggleViewVideoIntroduction}
                  />
                </div>
              </div>
            </div>
          </div>
          <ScrollDownArrow />
        </section>
        <section className="introduction-section" id="intro-service-id">
          <div className="container-custom">
            <div className="row">
              <div className="col-12 col-md-12">
                <h3 className="home-introduction-title">
                  Get hired for <strong>who you are</strong>, not what you look like on paper. What will you say in your
                  elevator pitch to potential employers?
                </h3>
              </div>
            </div>
          </div>
        </section>
        <section className="feature-section">
          <div className="container-custom">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4">
                <div className="box-feature-inner">
                  <div className="box-shadow-wide feature feature-3 boxed boxed--lg boxed--border text-center">
                    <span className="icon color--primary icon--lg icon-Cranium" />

                    <h4 className="text-center">Prepare</h4>
                    <p className="content-box-tt">
                      Brainstorm ideas for your 30-second introduction video, including a highlight reel of your
                      education, work experience, and skills.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-4">
                <div className="box-feature-inner">
                  <div className="box-shadow-wide feature feature-3 boxed boxed--lg boxed--border text-center">
                    <span className="icon color--primary icon--lg icon-Tripod-withCamera" />

                    <h4>Record</h4>
                    <p className="content-box-tt">
                      With your device’s camera, film the centerpiece of your profile in as many takes as you’d like.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-4">
                <div className="box-feature-inner">
                  <div className="box-shadow-wide feature feature-3 boxed boxed--lg boxed--border text-center">
                    <span className="icon color--primary icon--lg icon-Video-2" />

                    <h4>Get Creative</h4>
                    <p className="content-box-tt">
                      Be sure to fill out the rest of your profile, add personal flair, and share on your social
                      networks.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-12 stated-section">
            {userInfo ? <NavLink
                    exact
                    className="nav-link"
                    to={RoutePaths.USER_PROFILE.getPath(userInfo && userInfo.username)}
                  >
                    <button className="get-started-btn"> Get Started</button>
                  </NavLink>
            :<a href="/register"><button className="get-started-btn"> Get Started</button></a> }
              </div>
            </div>
          </div>
        </section>
        <section className="stated-video-section">
            <div className="container-custom">
              <div className="row">
                <div className="col-12 col-md-12 stated-video">
                  <div className="col-12 col-md-6 start-content-video">
                  <div className="modal-instance modal-start">
                    <div
                      className="video-play-icon modal-trigger"
                      data-modal-index="0"
                      onClick={this.toggleViewAnaVideo}
                    />
                  </div>
                  <video
                      ref={this.videoRef}
                      controlsList="nodownload"
                      autoPlay
                      loop
                      playsInline
                      muted
                      src={`${APP_URI}/videos/home/Ava_s_Video.mp4`}
                    >
                      <source src={`${APP_URI}/videos/home/Ava_s_Video.mp4`} type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                    <img src={Anna} className="video-bg-image"/>
                  </div>
                  <div className="col-12 col-md-6 video-content">
                  <div className="stated-text">
                    <h3>AVA'S PROFILE OVERVIEW</h3>
                    <p>Walk through Belooga's user friendly video resume platform with Ava. See how you can easily record and share your video with potenial employers.</p>
                  </div>
                  </div>
                </div>
                <div className="col-12 col-md-12 stated-video">
                <div className="col-12 col-md-6 video-content">
                <div className="stated-text">
                    <h3>INSPIRE YOUR RESUME</h3> 
                    <p>Regardless of your career path, Belooga helps you land the job of your dreams. Take a look at how to bring your resume to the next level!</p>
                  </div>
                  </div>
                  <div className="col-12 col-md-6 start-content-video" id="start-video-inspire">
                  <div className="modal-instance modal-start">
                    <div
                      className="video-play-icon modal-trigger"
                      data-modal-index="0"
                      onClick={this.toggleViewInspireVideo}
                    />
                  </div>
                  <video
                      ref={this.videoRef}
                      controlsList="nodownload"
                      autoPlay
                      playsInline
                      loop
                      muted
                      src={`${APP_URI}/videos/home/Inspire_Your_Resume.mp4`}
                    >
                      <source src={`${APP_URI}/videos/home/Inspire_Your_Resume.mp4`} type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                    <img src={inspire} className="video-bg-image"/>
                  </div>
                </div>
              </div>
            </div>
        </section>
        <section className="examples-section">
          <div className="container-custom">
            <div className="row">
              <div className="col-12 col-md-12">
                <h2>Here are some 30-second elevator pitch examples.</h2>
              </div>
            </div>
          </div>
          <div className="container-custom">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4">
                <div className="example-box">
                  <div className="box-shadow-wide jazmin feature feature-1">
                    <a className="modal-trigger" data-modal-index="1" onClick={this.toggleShowExampleFirst}>
                      <img src="/images/home/Jazmin-1.jpg" className="attachment-large size-large" />
                    </a>
                    <div className="feature__body boxed boxed--border">
                      <h3>Jazmin</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4">
                <div className="example-box">
                  <div className="box-shadow-wide jazmin feature feature-1">
                    <a className="modal-trigger" data-modal-index="1" onClick={this.toggleShowExampleSecond}>
                      <img src="/images/home/Jeremy-1.jpg" className="attachment-large size-large" />
                    </a>
                    <div className="feature__body boxed boxed--border">
                      <h3>Jeremy</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4">
                <div className="example-box">
                  <div className="box-shadow-wide jazmin feature feature-1">
                    <a className="modal-trigger" data-modal-index="1" onClick={this.toggleShowExampleThird}>
                      <img src="/images/home/Rileigh-1.jpg" className="attachment-large size-large" />
                    </a>
                    <div className="feature__body boxed boxed--border">
                      <h3>Rileigh</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { userInfo: selectUserInfo(state), ...selectAuthState(state) };
};

export default connect(
  mapStateToProps,
  { getUserInfoAction }
)(HomeScene);
