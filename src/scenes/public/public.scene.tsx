import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  IconButton,
  VideoPlayer,
  UserSidebarPublic,
  LoadingIcon,
  Modal,
  VideoPlayerExperience,
  VideoPlayerEducation
} from '../../commons/components';

import {
  selectUserInfo,
  getUserPublicAction,
  selectUserInfoExist,
  selectIsLoading
} from '../../ducks/user-public.duck';
import { exportProfilePdfAction, selectProfilePdfUrl, selectIsLoadingPdf } from '../../ducks/user-pdf.duck';
import { UserType } from '../../commons/types/view-model';
import { enhanceGenericListPublic, loadingWithConfig, enhanceUserSidebarPublic } from '../../HOCs';
import sassVariable from '../../styles/variables.module.scss';
import styles from './public.scene.module.scss';
import { RoutePaths, videoConfig } from '../../commons/constants';
import { userInfo } from 'os';
import { nextTick } from 'q';
import { Link } from 'react-router-dom';
import SearchBar from '../../commons/components/search-bar/search-bar';
import { Dispatch } from 'redux';
import { setActiveIndexSearchSuggest } from '../../ducks/search-profile.duck';
import Report from '../../commons/components/_forms/report-form/report';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PublicSceneProps {
  getUserPublicAction: any;
  selectIsLoading: any;
  userInfo?: any;
  history: any;
  exportProfilePdfAction: any;
  profilePdfUrl: any;
  isLoadingPdf: false;
  match: any;
  location: any;
  isLoading: boolean;
  setActiveIndexSearchSuggest: Function;
  isOpenReportModal: boolean;
  detail: string;
}

const EnhanceUserSidebarPublic = enhanceUserSidebarPublic(UserSidebarPublic);
const EnhancedEducationList = enhanceGenericListPublic(GenericList, EducationListItem);
const EnhancedExperienceList = enhanceGenericListPublic(GenericList, ExperienceListItem);
const EnhancedCertificationList = enhanceGenericListPublic(GenericList, CertificationListItem);
const EnhancedSkillList = enhanceGenericListPublic(GenericList, SkillListItem);
const EnhancedLanguageList = enhanceGenericListPublic(GenericList, LanguageListItem);
const EnhancedInterestList = enhanceGenericListPublic(GenericList, InterestListItem);

const DefaultLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'component-loading-wrapper', 30);
const DefaultLoadingPage = loadingWithConfig(LoadingIcon);

const sidebarSections = (userInfo: any) => {
  return (
    <React.Fragment>
      <EnhancedSkillList
        title="Professional Skills"
        hasIcon={false}
        classComponent="sidebar-skills"
        itemClassName="col-12"
        data={userInfo ? userInfo.skills : null}
        WrapperComponent={(props: any) => {
          return <div className={styles['listitem-container']}>{props.children}</div>;
        }}
      />
      <EnhancedInterestList
        title="Personal Interests"
        itemClassName="col-4"
        classComponent="sidebar-interest"
        hasIcon={false}
        data={userInfo ? userInfo.interests : null}
        WrapperComponent={(props: any) => {
          return <div className={styles['listitem-container']}>{props.children}</div>;
        }}
      />
      <EnhancedLanguageList
        title="Languages"
        hasIcon={false}
        classComponent="sidebar-language"
        itemClassName="col-12"
        data={userInfo ? userInfo.languages : null}
        WrapperComponent={(props: any) => {
          return <div className={styles['listitem-container']}>{props.children}</div>;
        }}
      />
    </React.Fragment>
  );
};

class PublicScene extends Component<PublicSceneProps> {
  node: any;
  dropNode: any;
  state = {
    isOpenReportModal: false,
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
    numPages: null,
    pageNumber: 1,
    showViewVideoEducation: false,
    dataPreviewEducation: {
      title: 'View video',
      videoSource: '',
      showTitle: false,
      backgroundImage: '',
      imageCover: '',
      uploadType: ''
    },
    isUserOptionOpen: false,
    profileNotPublic: false,
    isExportPdf: false,
    isBrowserBlocked: false,
    isScroll: "sticky-header"
  };

  componentWillMount() {
    const { match, location, getUserPublicAction, setActiveIndexSearchSuggest } = this.props;
    setActiveIndexSearchSuggest(-1);
    getUserPublicAction(match.params.username);
  }

  componentWillUpdate(nextProps: any) { }

  componentWillReceiveProps(nextProps: any) {
    const { isLoading, isUserExist, userInfo, profilePdfUrl } = nextProps;
    if (!isLoading && isUserExist && !this.state.profileNotPublic && !userInfo.status_opportunity) {
      this.setState({ profileNotPublic: true });
    }

    if (this.state.isExportPdf && profilePdfUrl.pdf_url) {
      const newWin = window.open(profilePdfUrl.pdf_url, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
        this.setState({ isBrowserBlocked: true });
      }
      this.setState({ isExportPdf: false });
    }
  }

  componentDidUpdate(prevProps: PublicSceneProps) {
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

    if (prevProps.match !== this.props.match) {
      const { match, getUserPublicAction, setActiveIndexSearchSuggest } = this.props;
      setActiveIndexSearchSuggest(-1);
      getUserPublicAction(match.params.username);
    }

    if (prevProps.detail !== this.props.detail && this.props.detail === 'Report has been sent.') {
      this.setState({
        isOpenReportModal: false
      });
    } else {
      // Notify error from server
    }
  }

  handleExportPdf = (e: any) => {
    e.preventDefault();
    const { userInfo, exportProfilePdfAction } = this.props;
    exportProfilePdfAction(userInfo.user_id);
    this.setState({ isExportPdf: true });
  };

  handleOpenUserOption = () => {
    this.setState({
      isUserOptionOpen: !this.state.isUserOptionOpen
    });
  };

  handleClickOutModal = (event: any) => {
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

  toggleModalReport = () => {
    this.setState({ isOpenReportModal: !this.state.isOpenReportModal });
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
    const { isUserOptionOpen, isOpenReportModal, isBrowserBlocked } = this.state;
    const publicUrl = window.location.href;
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
            <a className={`social-menu`} onClick={this.handleOpenUserOption}>
              <IconButton className="justify-content-end" iconClass="icon-share" buttonName="Share on Social" />
              <ul
                ref={(ref: any) => {
                  this.dropNode = ref;
                }}
                className={`dropdown-menu dropdown__content ${styles['dropdown__content']} ${
                  isUserOptionOpen ? ' show' : ''
                  }`}
              >
                <li>
                  <FacebookShareButton url={publicUrl} className={styles['social-share-button']}>
                    <FacebookIcon size={32} round /> <span className={styles['share-label']}>Share on Facebook</span>
                  </FacebookShareButton>
                </li>
                <li>
                  <GooglePlusShareButton url={publicUrl} className={styles['social-share-button']}>
                    <GooglePlusIcon size={32} round /> <span className={styles['share-label']}>Share on Google+</span>
                  </GooglePlusShareButton>
                </li>
                <li>
                  <LinkedinShareButton url={publicUrl} className={styles['social-share-button']}>
                    <LinkedinIcon size={32} round /> <span className={styles['share-label']}>Share on Linkedin</span>
                  </LinkedinShareButton>
                </li>
                <li>
                  <TwitterShareButton url={publicUrl} className={styles['social-share-button']}>
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
  onDocumentLoadSuccess = (numPages:any) => {
    this.setState({ numPages });
  }

  renderBlockAttachment() {
    const { userInfo } = this.props;
    let resumeName = '';
    if (userInfo && userInfo.resume_url) {
      const resumeUrl = userInfo.resume_url;
      const splitUrlResume = resumeUrl.split('/');
      resumeName = splitUrlResume[splitUrlResume.length - 1];
      resumeName = resumeName.replace('.pdf', '');
    }
    const {pageNumber, numPages}= this.state;
    return (
      <div className="block-component component-attachment">
        <div className="block-component-inner">
          <div className="block-component-title attactment-block-margin d-flex justify-content-between align-items-center">
            <h5 className="text-uppercase">
              <i className="icon-attachment" />
              <span>Attachment</span>
            </h5>
          </div>
          <div className="content-list">
            {resumeName ? (
              <div className="row">
                <div className="col-12 col-md-12">
                  <div className="attachment-file-name">
                    <a href={userInfo.resume_url} target="_blank" className="pdf-profile-img">
                      {resumeName}
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
          </div>
        </div>
      </div>
    );
  }

  renderErrorBlock = () => {
    return (
      <React.Fragment>
        <section className="height-100 text-center not-public-block">
          <div className="container pos-vertical-center">
            <div className="row">
              <div className="col-md-12">
                <p className="lead">The Belooga profile you are attempting to access is not currently public.</p>
                <Link to={RoutePaths.INDEX}>Go back to home page</Link>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  };

  render() {
    const { userInfo, isLoading, match } = this.props;
    const {
      showViewVideoExperience,
      showViewVideoEducation,
      dataPreviewExperience,
      dataPreviewEducation,
      isOpenReportModal
    } = this.state;
    const userSidebarContainerClass = userInfo ? 'belooga-container' : 'belooga-container hide';
    const usernameOfUserLogin = localStorage.getItem('userTemp');
    return isLoading ? (
      <React.Fragment>{DefaultLoadingPage}</React.Fragment>
    ) : this.state.profileNotPublic ? (
      this.renderErrorBlock()
    ) : (
          <React.Fragment>
            <div
              className={`profile-page-container container public-page ${styles['padding-top']}`}
              ref={node => (this.node = node)}
            >
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
              <div className="main-toolbar">
                {this.renderToolBox()}
              </div>
              <div className="main-content">
                <div className={`left-content ${userSidebarContainerClass}`}>
                  <EnhanceUserSidebarPublic
                    sections={sidebarSections}
                    userInfo={userInfo}
                    toggleModalReport={this.toggleModalReport}
                  />
                </div>
                <div className="right-content">
                  <div className={`container section-container`}>
                    {window.innerWidth >= 768 && (
                      <GenericList
                        isPublicPage={true}
                        isResumeVideo={true}
                        isMyPublicProfile={
                          (usernameOfUserLogin !== null ? JSON.parse(usernameOfUserLogin)['key'] : '') ===
                          match.params.username
                        }
                        toggleReportModal={this.toggleModalReport}
                        title="Video Resume"
                        iconClass="far fa-edit"
                        hasIcon={false}
                        classComponent="component-video-resume"
                        data={
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
                        }
                        itemClassName="col-12"
                        listItemProps={{
                          height: 'auto',
                          isShowLogo: true,
                          videoUploaded: userInfo ? userInfo.video_uploaded : false
                        }}
                        ListItemComponent={VideoPlayer}
                      />
                    )}
                    <EnhancedExperienceList
                      title="Experience"
                      itemClassName="col-12"
                      iconText="Add"
                      iconTitle="icon-experience"
                      viewVideo={this.toggleViewVideoExperience}
                      isShowUploadButton={false}
                      hasIcon={false}
                      isShowButtonVideo={userInfo && userInfo.job_video_url && userInfo.job_video_uploaded ? true : false}
                      LoadingComponent={DefaultLoading}
                      data={userInfo ? userInfo.jobs : null}
                      isLoading={isLoading}
                    />
                    <EnhancedEducationList
                      title="Education"
                      viewVideo={this.toggleViewVideoEducation}
                      isShowUploadButton={false}
                      isShowButtonVideo={
                        userInfo && userInfo.school_video_url && userInfo.school_video_uploaded ? true : false
                      }
                      itemClassName="col-12"
                      iconText="Add"
                      hasIcon={false}
                      iconTitle="icon-education"
                      LoadingComponent={DefaultLoading}
                      data={userInfo ? userInfo.educations : null}
                      isLoading={isLoading}
                    />
                    <EnhancedCertificationList
                      title="Awards & Certifications"
                      itemClassName="col-12"
                      classComponent="certifications-component"
                      iconText="Add"
                      iconTitle="icon-certification"
                      hasIcon={false}
                      LoadingComponent={DefaultLoading}
                      data={userInfo ? userInfo.awards : null}
                      isLoading={isLoading}
                    />
                    {userInfo && userInfo.resume_url ? this.renderBlockAttachment() : null}
                  </div>
                </div>
              </div>
            </div>
            <Modal
              isOpen={isOpenReportModal}
              className="view-video-modal view-model-report-custom"
              size="big"
              toggleModal={this.toggleModalReport}
            >
              <Report isOpenReportModal={isOpenReportModal} />
            </Modal>
          </React.Fragment>
        );
  }
}

const mapStateToProps = (state: any) => {
  return {
    userInfo: selectUserInfo(state),
    profilePdfUrl: selectProfilePdfUrl(state),
    isUserExist: selectUserInfoExist(state),
    isLoading: selectIsLoading(state),
    isLoadingPdf: selectIsLoadingPdf(state),
    detail: state.ReportPostListReducer.data.detail
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getUserPublicAction: (params: string) => dispatch(getUserPublicAction(params)),
    exportProfilePdfAction: (params: any) => dispatch(exportProfilePdfAction(params)),
    setActiveIndexSearchSuggest: (param: number) => dispatch(setActiveIndexSearchSuggest(param))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicScene);

// export default connect(
//   mapStateToProps,
//   {
//     getUserPublicAction,
//     exportProfilePdfAction,
//     setActiveIndexSearchSuggest
//   }
// )(PublicScene);
