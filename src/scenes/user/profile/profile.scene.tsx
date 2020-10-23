import React, { Component } from 'react';
import { connect } from 'react-redux';
import Upload from 'rc-upload';
import { getApiPath } from '../../../utils';
import { ApiPaths, RoutePaths, videoConfig } from '../../../commons/constants';
import axios from 'axios';
import SearchBar from '../../../commons/components/search-bar/search-bar';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  GooglePlusIcon,
  LinkedinIcon,
  TwitterIcon
} from 'react-share';
import {
  GenericList,
  EducationListItem,
  CertificationListItem,
  SkillListItem,
  LanguageListItem,
  InterestListItem,
  ExperienceListItem,
  UploadVideoWindow,
  IconButton,
  VideoPlayer,
  VideoPlayerExperience,
  VideoPlayerEducation,
  UserSidebar,
  LoadingIcon,
  Modal,
  Confirm,
  Alert
} from '../../../commons/components';
// GenericListEx
import {
  uploadAvatarRequestAction,
  selectIsNewUser,
  selectIsUserInfoExists,
  selectUserInfo,
  getUserInfoAction,
  selectIsRedirect,
  selectIsLoading,
  getAuthorizationHeadersAction,
  selectAuthorizationHeaders,
  userRemoveResumeAction,
  removeCoverVideoAction,
  removeJobVideoAction,
  removeEducationVideoAction,
  userUpdateFreshAction,
  updateUserStatusOpportunity
} from '../../../ducks/user.duck';
import { exportProfilePdfAction, selectProfilePdfUrl, selectIsLoadingPdf } from '../../../ducks/user-pdf.duck';
import { logoutAction } from '../../../ducks/login.duck';
import { UserType } from '../../../commons/types/view-model';
import { enhanceGenericList, loadingWithConfig, enhanceUserSidebar } from '../../../HOCs';
import sassVariable from '../../../styles/variables.module.scss';
import styles from './profile.scene.module.scss';
import { confirmAlert } from 'react-confirm-alert';
import ReactJoyride, { EVENTS, STATUS, ACTIONS } from 'react-joyride';
import SearchForm from '../../../commons/components/_forms/search-form/search-form';
import { setTimeout } from 'timers';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface ProfileSceneProps {
  selectedData: any;
  getJobOpeningList: any;
  getUserInfoAction: any;
  videoListItemData: any;
  userInfo?: any;
  logoutAction: any;
  uploadAvatarRequestAction: any;
  history: any;
  match: any;
  checkValidUsernameAction: any;
  updateUserContactInfoAction: any;
  exportProfilePdfAction: any;
  profilePdfUrl: any;
  isLoadingPdf: false;
  getAuthorizationHeadersAction: any;
  authorizationHeaders: any;
  isLoading: false;
  joyride: any;
  userRemoveResumeAction: any;
  removeCoverVideoAction: any;
  removeJobVideoAction: any;
  removeEducationVideoAction: any;
  userUpdateFreshAction: any;
  updateUserStatusOpportunity: any;
}

const EnhanceUserSidebar = enhanceUserSidebar(UserSidebar);
const EnhancedEducationList = enhanceGenericList(GenericList, EducationListItem);
const EnhancedExperienceList = enhanceGenericList(GenericList, ExperienceListItem);
const EnhancedCertificationList = enhanceGenericList(GenericList, CertificationListItem);
const EnhancedSkillList = enhanceGenericList(GenericList, SkillListItem);
const EnhancedLanguageList = enhanceGenericList(GenericList, LanguageListItem);
const EnhancedInterestList = enhanceGenericList(GenericList, InterestListItem);

const DefaultLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'component-loading-wrapper', 30);
const DefaultLoadingPage = loadingWithConfig(LoadingIcon);

const sidebarSections = [
  <EnhancedSkillList
    title="Professional Skills"
    itemClassName="col-12"
    classComponent="sidebar-skills sidebar-skills--intro"
    WrapperComponent={(props: any) => {
      return <div className={styles['listitem-container']}>{props.children}</div>;
    }}
  />,
  <EnhancedInterestList
    title="Personal Interests"
    classComponent="sidebar-interest"
    itemClassName="col-4"
    WrapperComponent={(props: any) => {
      return <div className={styles['listitem-container']}>{props.children}</div>;
    }}
  />,
  <EnhancedLanguageList
    title="Languages"
    classComponent="sidebar-language"
    itemClassName="col-12"
    WrapperComponent={(props: any) => {
      return <div className={styles['listitem-container']}>{props.children}</div>;
    }}
  />
];
const newUser = true;

class ProfileScene extends Component<ProfileSceneProps, any> {
  scrollTopAtResolution: boolean = false;
  node: any;
  dropNode: any;
  constructor(props: ProfileSceneProps) {
    super(props);
    const screenWidth = window.innerWidth;
    this.state = {
      isOpenJoyrideToolTip: true,
      isOpenUploadModal: false,
      isOpenUpContactInfoModal: false,
      uploadType: 'resume',
      showViewVideoExperience: false,
      dataPreviewExperience: {
        title: 'View video',
        videoSource: '',
        showTitle: false,
        backgroundImage: '',
        imageCover: '',
        uploadType: ''
      },
      showViewVideoEducation: false,
      dataPreviewEducation: {
        title: 'View video',
        videoSource: '',
        showTitle: false,
        backgroundImage: '',
        imageCover: '',
        uploadType: ''
      },
      isLoadingPage: true,
      isUserOptionOpen: false,
      isOpenConfirmSocialModal: false,
      publicURL: '',
      resume: {
        resume: File,
        progressUploadResume: 0,
        success: false,
        failed: false,
        notify: ''
      },
      numPages: null,
      pageNumber: 1,
      dataVideoCover: [],
      resumeName: '',
      hasVideo: false,
      showViewVideoCoverButton: false,
      showViewVideoExperienceButton: false,
      showViewVideoEducationButton: false,
      steps: [
        {
          target: '.nav-link',
          content: (
            <div className="tooltips-title">
              <span>WELCOME TO BELOOGA!</span>
              <p>Click "Next" to take a tour of your new video resume profile page.</p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: screenWidth >= 768 ? 'bottom' : 'auto'
        },
        {
          target: '.about-title',
          content: (
            <div className="tooltips-title">
              <span>1/7: SEE CONTACT INFO</span>
              <p>Change username, add social links, show/hide phone number and email.</p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: screenWidth >= 768 ? 'right' : 'auto'
        },
        {
          target: '.sidebar-interest .wrap-action-right',
          content: (
            <div className="tooltips-title">
              <span>2/7: ABOUT/SKILLS/INTERESTS/LANGUAGES</span>
              <p>Add relevant information to these sections to build out your profile and highlight your strengths.</p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: screenWidth >= 768 ? 'right' : 'auto'
        },
        {
          target: '.component-video-resume .block-component-inner .block-component-title .text-uppercase',
          content: (
            <div className="tooltips-title">
              <span>3/7: VIDEO RESUME</span>
              <p> Upload or record your 30-second pitch video. Choose a cover photo.</p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: 'left'
        },
        {
          target: '.icon-education',
          content: (
            <div className="tooltips-title">
              <span>4/7: EXPERIENCE/EDUCATION/AWARDS</span>
              <p>
                Fill out the rest of your profile by completing each section and adding additional optional videos.
              </p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: screenWidth >= 768 ? 'left' : 'auto'
        },
        {
          target: '.icon-attachment',
          content: (
            <div className="tooltips-title">
              <span>5/7: ATTACHMENT</span>
              <p> Include one PDF to contribute to the information on your profile (ie: portfolio, resume, etc).</p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: screenWidth >= 768 ? 'left' : 'auto'
        },
        {
          target: '.block-seeking',
          content: (
            <div className="tooltips-title">
              <span>6/7: SEEKING OPPORTUNITIES</span>
              <p> Once your profile is complete, toggle this slider to make your profile public and shareable.</p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: screenWidth >= 768 ? 'top' : 'auto'
        },
        {
          target: '.icon-export',
          content: (
            <div className="tooltips-title">
              <span>7/7: SHARE ON SOCIAL/EXPORT TO PDF</span>
              <p> Share your video resume with friends or export to a PDF to bring to an interview.</p>
              <button className="skip-button" onClick={() => this.handleSkipTooltips()}>
                Skip
              </button>
            </div>
          ),
          disableBeacon: true,
          offset: -10,
          placement: screenWidth >= 768 ? 'bottom-start' : 'auto'
        }
      ],
      run: false,
      stepIndex: 0,
      isExportPdf: false,
      isBrowserBlocked: false,
      isScroll: "sticky-header"
    };
  }

  updateFresh = (callback: any) => {
    this.setState({ run: false });

    const { userUpdateFreshAction } = this.props;
    userUpdateFreshAction();

    callback();
  };

  handleSkipTooltips = () => {
    this.setState({ run: false });
    const _self = this;
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>

            <p className="confirm-message">Are you sure you want to skip your profile walkthrough?</p>
            <div className="confirm-button">
              <a onClick={_self.updateFresh.bind(_self, onClose)} className="confirm-ok-button">
                Ok
              </a>
              <a
                onClick={() => {
                  _self.setState({ run: true });
                  onClose();
                }}
                className="confirm-cancel-button"
              >
                Cancel
              </a>
            </div>
          </div>
        );
      }
    });
  };
  handleJoyrideCallback = (data: any) => {
    const { type, status, action, index, lifecycle } = data;
    if (action === 'update' && index === 1 && lifecycle === 'tooltip') {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 325);
    }
    if (status === 'skipped') {
      return false;
    }
    if (type === EVENTS.TOUR_END && this.state.run) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false });
      const { userUpdateFreshAction } = this.props;
      userUpdateFreshAction();
    }
    // this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
  };
  handleClickStart = (e: any) => {
    e.preventDefault();
    this.setState({
      run: true
    });
  };
  onClickQuestion = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Add one .pdf attachment (portfolio, resume, etc)</p>
            <div className="confirm-button">
              <a onClick={onClose} className="confirm-ok-button">
                Ok
              </a>
            </div>
          </div>
        );
      }
    });
  };
  getParamsFromUrl = (paramName: string) => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    return url.searchParams.get(paramName);
  };

  componentWillReceiveProps(nextProps: any) {
    const { userInfo, isLoading, profilePdfUrl } = nextProps;
    try {
      if (userInfo && userInfo.is_fresh === true && isLoading === false && isLoading !== this.props.isLoading) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 1500);
        setTimeout(() => {
          this.setState({ run: true });
        }, 5000);
      }

      if (nextProps !== this.props && nextProps.userInfo && nextProps.userInfo.username) {
        /** Check redirect fix reminder */
        const isSameUserLogin = window.location.pathname.includes(nextProps.userInfo.username);
        const isReminder = this.getParamsFromUrl('isReminder'); /**null|1 */
        const { logoutAction, history } = this.props;
        if (!isSameUserLogin && isReminder == '1') {
          logoutAction();
          setTimeout(() => {
            history.push(RoutePaths.LOGIN);
          }, 100);
          return;
        }
        if (isSameUserLogin && isReminder == '1') {
          history.push(RoutePaths.USER_PROFILE.getPath(nextProps.userInfo.username));
        }
        /** End fix redirect reminder */

        /**Fix crashed in public profile. Not found username of user profile */
        localStorage.setItem('userTemp', JSON.stringify({ key: nextProps.userInfo.username }));
        /**End fix */

        if (userInfo && userInfo.resume_url) {
          const resumeUrl = userInfo.resume_url;
          const splitUrlResume = resumeUrl.split('/');
          let rName = '';
          rName = splitUrlResume[splitUrlResume.length - 1];
          rName = rName.replace('.pdf', '');
          this.setState({ resumeName: rName });
        }
        this.setState({
          showViewVideoExperienceButton:
            userInfo && userInfo.job_video_url && userInfo.job_video_uploaded ? true : false
        });
        this.setState({
          showViewVideoEducationButton:
            userInfo && userInfo.school_video_url && userInfo.school_video_uploaded ? true : false
        });
        this.setState({
          showViewVideoCoverButton: userInfo && userInfo.video_url && userInfo.video_uploaded ? true : false
        });
        if (this.state.uploadType === 'resume') {
          this.setState({ hasVideo: userInfo && userInfo.video_url && userInfo.video_uploaded ? true : false });
        } else if (this.state.uploadType === 'education') {
          this.setState({
            hasVideo: userInfo && userInfo.school_video_url && userInfo.school_video_uploaded ? true : false
          });
        } else if (this.state.uploadType === 'experience') {
          this.setState({ hasVideo: userInfo && userInfo.job_video_url && userInfo.job_video_uploaded ? true : false });
        }
        this.setState({
          dataVideoCover:
            userInfo && userInfo.video_url
              ? [
                {
                  title: '',
                  videoSource: userInfo && userInfo.video_url,
                  showTitle: false,
                  backgroundImage: userInfo && userInfo.cover_image_url
                }
              ]
              : [
                {
                  title: '',
                  videoSource: '/videos/video_introduction_none.mp4',
                  showTitle: false,
                  backgroundImage: '',
                  isDefaultVideo: true
                }
              ]
        });
      }

      if (this.state.isExportPdf && profilePdfUrl.pdf_url) {
        const newWin = window.open(profilePdfUrl.pdf_url, '_blank');
        if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
          this.setState({ isBrowserBlocked: true });
        }
        this.setState({ isExportPdf: false });
      }
    } catch (e) {
      //console.log(e.message);
    }
  }

  componentWillMount() {
    const { getUserInfoAction, getAuthorizationHeadersAction, match } = this.props;
    getUserInfoAction();
    getAuthorizationHeadersAction();
    const publicURL = process.env.REACT_APP_URI + RoutePaths.USER_PUBLIC.getPath(match.params.username);
    this.setState({ publicURL: publicURL });

    // Fix scroll at resolution
    this.scrollTopAtResolution = true;
  }

  componentWillUpdate(nextProps: any) {
    const { history, location, userInfo, isRedirect, profilePdfUrl, match } = nextProps;
    const pathname = location.pathname;
    if (userInfo) {
      const validPathname = RoutePaths.USER_PROFILE.getPath(userInfo.username);
      const publicPath = pathname.replace('user', 'public');
      if (pathname !== validPathname) {
        isRedirect ? history.replace(validPathname) : history.replace(publicPath); // RoutePaths.NOT_FOUND
      }
    }
    if (userInfo && !userInfo.submitted) {
      history.push(RoutePaths.USER_UPDATE_PROFILE.getPath(userInfo.username));
    }
  }

  handleOpenUserOption = () => {
    const { userInfo } = this.props;
    if (userInfo && userInfo.status_opportunity) {
      this.setState({
        isUserOptionOpen: !this.state.isUserOptionOpen
      });
    } else {
      this.setState({
        isOpenConfirmSocialModal: !this.state.isOpenConfirmSocialModal
      });
    }
  };

  handleClickOutModal = (event: any) => {
    // if (this.state.isUserOptionOpen && event.target.getAttribute('data-name') === "data-social") {
    //   this.setState({
    //     isUserOptionOpen: false
    //   });
    // }
    // if (this.node.contains(event.target)) {
    //   return;
    // }
    // this.setState({
    //   isUserOptionOpen: false
    // });
    if (!this.dropNode.contains(event.target) && this.state.isUserOptionOpen) {
      this.setState({
        isUserOptionOpen: false
      });
    }
  };

  componentDidUpdate(prevProps: ProfileSceneProps, prevStates: any) {
    const { isUserOptionOpen } = this.state;
    if (isUserOptionOpen) {
      if (window.innerWidth < 768) {
        document.addEventListener('touchstart', this.handleClickOutModal);
      } else {
        document.addEventListener('mousedown', this.handleClickOutModal);
      }
    } else {
      if (window.innerWidth < 768) {
        document.removeEventListener('touchstart', this.handleClickOutModal);
      } else {
        document.removeEventListener('mousedown', this.handleClickOutModal);
      }
    }

    if (
      this.props.isLoading !== prevProps.isLoading &&
      !this.props.isLoading &&
      this.props.userInfo &&
      this.scrollTopAtResolution
    ) {
      this.scrollTopAtResolution = false;
      window.scrollTo(0, 0);
    }

    if (this.state.isOpenUploadModal !== prevStates.isOpenUploadModal) {
      this.setState({
        isOpenJoyrideToolTip: !this.state.isOpenUploadModal
      });
    } else if (this.state.isOpenUpContactInfoModal !== prevStates.isOpenUpContactInfoModal) {
      this.setState({
        isOpenJoyrideToolTip: !this.state.isOpenUpContactInfoModal
      });
    } else if (this.state.isOpenConfirmSocialModal !== prevStates.isOpenConfirmSocialModal) {
      this.setState({
        isOpenJoyrideToolTip: !this.state.isOpenConfirmSocialModal
      });
    }
  }

  handleOpenUploadVideoModal = () => {
    const { userInfo } = this.props;
    this.setState({
      uploadType: 'resume',
      isOpenUploadModal: !this.state.isOpenUploadModal,
      hasVideo: userInfo && userInfo.video_url && userInfo.video_uploaded ? true : false
    });
  };

  handleOpenUploadVideoModalEducation = () => {
    const { userInfo } = this.props;
    this.setState({
      uploadType: 'education',
      isOpenUploadModal: !this.state.isOpenUploadModal,
      hasVideo: userInfo && userInfo.school_video_url && userInfo.school_video_uploaded ? true : false
    });
  };

  handleOpenUploadVideoModalExperience = () => {
    const { userInfo } = this.props;
    this.setState({
      uploadType: 'experience',
      isOpenUploadModal: !this.state.isOpenUploadModal,
      hasVideo: userInfo && userInfo.job_video_url && userInfo.job_video_uploaded ? true : false
    });
  };

  handleExportPdf = (e: any) => {
    e.preventDefault();
    const { userInfo, exportProfilePdfAction } = this.props;
    exportProfilePdfAction(userInfo.user_id);
    this.setState({ isExportPdf: true });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    let lastScrollY = window.scrollY;
    let ticking = false

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (lastScrollY >= 10) {
          this.setState({ isScroll: 'sticky-header-onscroll' });
        } else {
          this.setState({ isScroll: 'sticky-header' });
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  renderToolBox = () => {
    const { profilePdfUrl, isLoadingPdf } = this.props;
    const { isUserOptionOpen, publicURL, isBrowserBlocked } = this.state;
    const cSocialLink = 'active-link';
    return (
      <React.Fragment>
        <div className="list-menu" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div className="left-content">
            <div className={this.state.isScroll}>
              <div className="sticky-header-content">
                <SearchBar history={this.props.history} defaultWidth={'100%'} />
              </div>
            </div>
          </div>
          <div className="header-tool-bar">
            <a className={`social-menu ${styles[cSocialLink]}`} onClick={this.handleOpenUserOption}>
              <IconButton
                className="justify-content-end"
                iconClass="icon-share"
                buttonName="Share on Social"
                dataName="social"
              />
              <ul
                ref={(ref: any) => {
                  this.dropNode = ref;
                }}
                className={`dropdown-menu dropdown__content ${styles['dropdown__content']} ${
                  isUserOptionOpen ? ' show' : ''
                  }`}
              >
                <li>
                  <FacebookShareButton url={publicURL} className={styles['social-share-button']}>
                    <FacebookIcon size={32} round /> <span className={styles['share-label']}>Share on Facebook</span>
                  </FacebookShareButton>
                </li>
                <li>
                  <GooglePlusShareButton url={publicURL} className={styles['social-share-button']}>
                    <GooglePlusIcon size={32} round /> <span className={styles['share-label']}>Share on Google+</span>
                  </GooglePlusShareButton>
                </li>
                <li>
                  <LinkedinShareButton url={publicURL} className={styles['social-share-button']}>
                    <LinkedinIcon size={32} round /> <span className={styles['share-label']}>Share on Linkedin</span>
                  </LinkedinShareButton>
                </li>
                <li>
                  <TwitterShareButton url={publicURL} className={styles['social-share-button']}>
                    <TwitterIcon size={32} round /> <span className={styles['share-label']}>Share on Twitter</span>
                  </TwitterShareButton>
                </li>
              </ul>
            </a>
            <a className="export-menu" onClick={this.handleExportPdf}>
              <IconButton iconClass="icon-export" className="justify-content-end" buttonName="Export Profile to PDF" />
            </a>
          </div>
          {isLoadingPdf ? (
            <div className="download-pdf-line">{DefaultLoading}</div>
          ) : isBrowserBlocked && profilePdfUrl && profilePdfUrl.pdf_url ? (
            <div className="download-pdf-line">
              <a className="download-link" href={profilePdfUrl.pdf_url} target="_blank">
                View Profile PDF
              </a>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  };

  toggleConfirmSocialModal = () => {
    this.setState({
      isOpenConfirmSocialModal: !this.state.isOpenConfirmSocialModal
    });
  };

  toggleViewVideoExperience = () => {
    const { userInfo } = this.props;
    this.setState({
      showViewVideoExperience: !this.state.showViewVideoExperience,
      dataPreviewExperience: {
        title: 'View Video',
        videoSource:
          userInfo && userInfo.job_video_url ? userInfo.job_video_url : '/videos/video_introduction_none.mp4',
        showTitle: false,
        backgroundImage: userInfo && userInfo.job_cover_image_url ? userInfo.job_cover_image_url : ''
      }
    });
  };

  toggleViewVideoEducation = () => {
    const { userInfo } = this.props;
    this.setState({
      showViewVideoEducation: !this.state.showViewVideoEducation,
      dataPreviewEducation: {
        title: 'View Video',
        videoSource:
          userInfo && userInfo.school_video_url ? userInfo.school_video_url : '/videos/video_introduction_none.mp4',
        showTitle: false,
        backgroundImage: userInfo && userInfo.school_cover_image_url ? userInfo.school_cover_image_url : ''
      }
    });
  };

  viewVideoCover = () => { };

  confirmRemoveVideo = () => {
    const _seft = this;
    try {
      confirmAlert({
        customUI: (data: any) => {
          const { onClose } = data;
          return (
            <div className="custom-ui-confirm">
              <a className="custom-close-confirm" onClick={onClose}>
                <img src="/images/icons/close-modal.png" />
              </a>
              <p className="confirm-message">Are you sure you want to delete this video?</p>
              <div className="confirm-button">
                <a onClick={_seft.removeVideo.bind(_seft, onClose)} className="confirm-ok-button">
                  OK
                </a>
                <a onClick={onClose} className="confirm-cancel-button">
                  Cancel
                </a>
              </div>
            </div>
          );
        }
      });
    } catch (e) {
      //console.log(e.message);
    }
  };

  removeVideo = (callback: any) => {
    const {
      removeCoverVideoAction,
      removeEducationVideoAction,
      removeJobVideoAction,
      updateUserStatusOpportunity
    } = this.props;
    const { uploadType } = this.state;
    if (uploadType === 'resume') {
      removeCoverVideoAction();
      setTimeout(() => {
        updateUserStatusOpportunity({ status_opportunity: false });
      }, 500);
    } else if (uploadType === 'education') {
      removeEducationVideoAction();
      setTimeout(() => {
        this.getUserInfo();
      }, 500);
    } else if (uploadType === 'experience') {
      removeJobVideoAction();
      setTimeout(() => {
        this.getUserInfo();
      }, 500);
    }
    callback();
  };

  getUserInfo = () => {
    this.setState({ isLoadingPage: false });
    const { getUserInfoAction } = this.props;
    getUserInfoAction();
  };

  submitAttachmentResume() {
    const { authorizationHeaders } = this.props;
    const formData = new FormData();
    const fileData: any = this.state.resume.resume;
    formData.append('resume', fileData);
    const headers = { ...authorizationHeaders };
    axios
      .patch(getApiPath(ApiPaths.UPLOAD_RESUME), formData, {
        headers: headers,
        onUploadProgress: (e: ProgressEvent) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            this.setState({ resume: { progressUploadResume: progress } });
          }
        }
      })
      .then((res: any) => {
        this.getUserInfo();
        this.setState({ resume: { success: true } });
        setTimeout(() => {
          this.setState({ resume: { success: false } });
        }, 3000);
      })
      .catch(err => {
        this.setState({ resume: { failed: true } });
        this.setState({
          coverImage: { notify: 'Error when upload your Resume.' }
        });
      });
  }

  selectResume = () => { };

  confirmRemoveAttachment = () => {
    const _seft = this;
    try {
      confirmAlert({
        customUI: (data: any) => {
          const { onClose } = data;
          return (
            <div className="custom-ui-confirm">
              <a className="custom-close-confirm" onClick={onClose}>
                <img src="/images/icons/close-modal.png" />
              </a>
              <p className="confirm-message">Are you sure you want to delete this attachment?</p>
              <div className="confirm-button">
                <a onClick={_seft.removeAttachment.bind(_seft, onClose)} className="confirm-ok-button">
                  OK
                </a>
                <a onClick={onClose} className="confirm-cancel-button">
                  Cancel
                </a>
              </div>
            </div>
          );
        }
      });
    } catch (e) {
      //console.log(e.message);
    }
  };

  removeAttachment = (callback: any) => {
    const { userRemoveResumeAction, userInfo } = this.props;
    userRemoveResumeAction();
    this.setState({ resumeName: '' });
    callback();
  };
  onDocumentLoadSuccess = (numPages:any) => {
    this.setState({ numPages });
  }

  renderBlockAttachment = () => {
    const { authorizationHeaders, userInfo } = this.props;
    const props = {
      multiple: false,
      action: this.selectResume(),
      type: 'drag',
      headers: {},
      accept: '.pdf',
      beforeUpload: (file: any, fileList: any) => {
        this.setState({
          resume: { progressUploadResume: 0, notify: '' }
        });
        if (file.type.split('/')[1] === 'pdf') {
          this.setState({
            resume: {
              resume: file
            }
          });
          const fileSize = 5242880;
          if (file.size > fileSize) {
            this.setState({ resume: { notify: 'Maximum file size is 5MB' } });
            return false;
          }
          return new Promise(resolve => {
            resolve(file);
          });
        }
        this.setState({
          resume: { notify: 'The upload must be pdf type.' }
        });
        return false;
      },
      onStart: (file: any) => {
        this.submitAttachmentResume();
      },
      onSuccess(file: any) { },
      onProgress({ percent }: any, file: any) { },
      onError(err: any) { },
      customRequest({ action, data, file, headers, onError, onProgress, onSuccess, withCredentials }: any) { }
    };
    
    const { resume, resumeName ,pageNumber, numPages} = this.state;
    const disableSelected = resume.progressUploadResume > 0 && resume.progressUploadResume < 100 ? true : false;

    return (
      <div className="block-component component-attachment">
        <div className="block-component-inner">
          <div className="block-component-title attactment-block-margin d-flex justify-content-between align-items-center">
            <h5 className="text-uppercase">
              <i className="icon-attachment" />
              <span>Attachment</span>
              <i
                className="fa fa-question-circle"
                onClick={this.onClickQuestion}
                style={{ color: '#39a0e8', marginLeft: 10, fontSize: 18 , cursor: 'pointer'}}
              />
            </h5>
          </div>
          <div className="content-list">
            {resumeName ? (
              <div className="row margin-bottom-20">
                <div className="col-12 col-md-12">
                  <div className="attachment-file-name">
                  <a href={userInfo.resume_url} target="_blank" className="pdf-profile-img">
                      {resumeName}
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="remove-attachment"
                      title="Remove attchment"
                      onClick={this.confirmRemoveAttachment.bind(this)}
                    >
                      <img src="/images/iconPopup/group-2.svg" />
                    </a>
                  </div>
                  <div className="attachment-file-img">
                  <div className="pdf-profile-icon">
                  <a href={userInfo.resume_url} target="_blank" className="pdf-profile-img">
                  <Document
                    file={userInfo.resume_url}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                </a>
                  </div>
                </div>
                </div>
              </div>
            ) : null}
            <div className="row">
              <div className="col-12 col-md-12">
                {!disableSelected ? (
                  <Upload {...props}>
                    <div className="attachment-zone">
                      <div className="attachment-content">
                        <div className="icon-label-container">
                          <i className="icon-upload" />
                          <label>Drag and drop .pdf file here or </label>
                        </div>
                        <button className="btn-upload-attachment">Browse</button>
                      </div>
                    </div>
                  </Upload>
                ) : (
                    <div className="attachment-zone-loading">
                      <div className="attachment-content">{DefaultLoading}</div>
                    </div>
                  )}
              </div>
            </div>
            {resume.success ? <Alert type="success" message="Uploaded successfully!" /> : null}
            {resume.notify ? <Alert type="alert" message={resume.notify} /> : null}
          </div>
        </div>
      </div>
    );
  };

  toggleViewContactInfo = () => {
    this.setState({
      isOpenUpContactInfoModal: !this.state.isOpenUpContactInfoModal
    });
  };

  render() {
    const { userInfo, isLoading, authorizationHeaders, updateUserStatusOpportunity } = this.props;
    const {
      isOpenJoyrideToolTip,
      isOpenUploadModal,
      uploadType,
      showViewVideoExperience,
      showViewVideoEducation,
      dataPreviewExperience,
      dataPreviewEducation,
      isOpenConfirmSocialModal,
      isLoadingPage,
      steps,
      run
    } = this.state;
    const userSidebarContainerClass = userInfo ? 'belooga-container' : 'belooga-container hide';
    let videoUrl = null;
    let coverImage = null;
    if (uploadType === 'resume') {
      videoUrl = userInfo && userInfo.video_url ? userInfo.video_url : '';
      coverImage = userInfo && userInfo.cover_image_url ? userInfo.cover_image_url : '';
    } else if (uploadType === 'experience') {
      videoUrl = userInfo && userInfo.job_video_url ? userInfo.job_video_url : '';
      coverImage = userInfo && userInfo.job_cover_image_url ? userInfo.job_cover_image_url : '';
    } else if (uploadType === 'education') {
      videoUrl = userInfo && userInfo.school_video_url ? userInfo.school_video_url : '';
      coverImage = userInfo && userInfo.school_cover_image_url ? userInfo.school_cover_image_url : '';
    }

    return isLoading && isLoadingPage ? (
      <React.Fragment>{DefaultLoadingPage}</React.Fragment>
    ) : (
        <React.Fragment>
          <div className={`profile-page-container container ${styles['padding-top']}`} ref={node => (this.node = node)}>
            <Modal
              isOpen={showViewVideoExperience}
              toggleModal={this.toggleViewVideoExperience}
              className="view-video-modal"
            >
              <VideoPlayerExperience
                isShowLogo={false}
                data={dataPreviewExperience}
                height={videoConfig.height}
                videoUploaded={userInfo ? userInfo.job_video_uploaded : false}
              />
            </Modal>
            <Modal
              isOpen={showViewVideoEducation}
              toggleModal={this.toggleViewVideoEducation}
              className="view-video-modal"
            >
              <VideoPlayerEducation
                isShowLogo={false}
                data={dataPreviewEducation}
                height={videoConfig.height}
                videoUploaded={userInfo ? userInfo.school_video_uploaded : false}
              />
            </Modal>
            <UploadVideoWindow
              authorizationHeaders={authorizationHeaders}
              toggleModal={this.handleOpenUploadVideoModal}
              handleupdateUserStatusOpportunity={updateUserStatusOpportunity}
              isOpen={isOpenUploadModal}
              uploadType={uploadType}
              userInfo={userInfo}
              getUserInfo={this.getUserInfo}
              isLoadingGetUserInfo={isLoading}
              data={{
                title: '',
                videoSource: videoUrl,
                showTitle: false,
                backgroundImage: coverImage
              }}
              LoadingComponent={DefaultLoading}
              hasVideo={this.state.hasVideo}
              removeVideo={this.confirmRemoveVideo}
            />
            <Modal
              isOpen={isOpenConfirmSocialModal}
              toggleModal={() => {
                this.toggleConfirmSocialModal();
              }}
            >
              <Confirm
                message="Please make your profile public before sharing on social."
                actionOk={() => {
                  this.toggleConfirmSocialModal();
                }}
                hasCancel={false}
              />
            </Modal>
            <div className="main-toolbar">
              {this.renderToolBox()}
            </div>
            <div className="main-content">
              <div className={`left-content ${userSidebarContainerClass}`}>
                <EnhanceUserSidebar
                  sections={sidebarSections}
                  userInfo={userInfo}
                  toggleViewContactInfo={this.toggleViewContactInfo}
                  handleOpenUploadVideoResumeModal={this.handleOpenUploadVideoModal}
                />
              </div>
              <div className="right-content">
                <div className={`container section-container`}>
                  {window.innerWidth >= 768 && (
                    <GenericList
                      title="Video Resume"
                      iconClass="far fa-edit"
                      classComponent="component-video-resume"
                      data={this.state.dataVideoCover}
                      itemClassName="col-12"
                      listItemProps={{
                        height: 'auto',
                        isShowLogo: false,
                        isResetVideo: (this.state.isOpenUploadModal || this.state.showViewVideoEducation || this.state.showViewVideoExperience) ? true : false,
                        videoUploaded: userInfo ? userInfo.video_uploaded : false
                      }}
                      ListItemComponent={VideoPlayer}
                      hasIcon={false}
                      isShowUploadButton={true}
                      onPressUploadVideo={this.handleOpenUploadVideoModal}
                    />
                  )}

                  <EnhancedExperienceList
                    title="Experience"
                    isExperience="Experience"
                    itemClassName="col-12"
                    iconText="Add"
                    iconTitle="icon-experience"
                    messageNoResults="You don't have any experience."
                    viewVideo={this.toggleViewVideoExperience}
                    isShowUploadButton={true}
                    isShowButtonVideo={this.state.showViewVideoExperienceButton}
                    onPressUploadVideo={this.handleOpenUploadVideoModalExperience}
                    LoadingComponent={DefaultLoading}
                    classComponent="component-experience"
                  />
                  <EnhancedEducationList
                    title="Education"
                    isEducation="Education"
                    viewVideo={this.toggleViewVideoEducation}
                    isShowUploadButton={true}
                    isShowButtonVideo={this.state.showViewVideoEducationButton}
                    onPressUploadVideo={this.handleOpenUploadVideoModalEducation}
                    itemClassName="col-12"
                    iconText="Add"
                    iconTitle="icon-education"
                    messageNoResults="You don't have any education."
                    LoadingComponent={DefaultLoading}
                    classComponent="component-education"
                  />
                  <EnhancedCertificationList
                    title="Awards & Certifications"
                    isCert="Certification"
                    itemClassName="col-12"
                    iconText="Add"
                    iconTitle="icon-certification"
                    messageNoResults="You don't have any award or certification."
                    LoadingComponent={DefaultLoading}
                  />
                  {this.renderBlockAttachment()}
                </div>
                {isOpenJoyrideToolTip && (
                  <ReactJoyride
                    continuous
                    disableOverlayClose
                    hideBackButton
                    spotlightClicks
                    disableOverlay
                    // scrollToFirstStep
                    scrollOffset={310}
                    scrollToSteps
                    locale={{ back: 'Back', close: 'Close', last: 'Got it!', next: 'Next', skip: 'Skip' }}
                    run={run}
                    steps={steps}
                    styles={{
                      options: {
                        zIndex: 1000,
                        backgroundColor: '#e4fffc',
                        color: '#FFF'
                      }
                    }}
                    callback={this.handleJoyrideCallback}
                  />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isNewUser: selectIsNewUser(state),
    isUserInfoExists: selectIsUserInfoExists(state),
    userInfo: selectUserInfo(state),
    isRedirect: selectIsRedirect(state),
    profilePdfUrl: selectProfilePdfUrl(state),
    isLoading: selectIsLoading(state),
    isLoadingPdf: selectIsLoadingPdf(state),
    authorizationHeaders: selectAuthorizationHeaders(state)
  };
};

export default connect(
  mapStateToProps,
  {
    logoutAction,
    uploadAvatarRequestAction,
    getUserInfoAction,
    exportProfilePdfAction,
    getAuthorizationHeadersAction,
    userRemoveResumeAction,
    removeCoverVideoAction,
    removeJobVideoAction,
    removeEducationVideoAction,
    userUpdateFreshAction,
    updateUserStatusOpportunity
  }
)(ProfileScene);
