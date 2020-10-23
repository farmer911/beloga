import React, { Component } from 'react';
import { UserInfo } from '../user-info/user-info';
import styles from './user-sidebar-public.module.scss';
import { GenericList } from '../generic-list/generic-list';
import { ContactInfo } from '../contact-info/contact-info';
import { ContactInfoForm } from '../_forms/contact-info-form/contact-info-form';
import { AboutForm } from '../_forms/about-form/about-form';
import { createForm } from 'rc-form';
import { Modal } from '../modal/modal';
import ShowMoreText from 'react-show-more-text';
import { VideoPlayer } from '../../../commons/components';

const EnhanceContactInfoForm = createForm()(ContactInfoForm);
const EnhanceAboutForm = createForm()(AboutForm);

interface JobOpeningItemPropTypes {
  sections: any;
  userInfo: any;
  logoutAction: any;
  handleUploadAvatar: any;
  handleUpdateUserInfo?: any;
  handleUpdateAbout?: any;
  handleUpdateJobTitle?: any;
  handleUpdateStatusOpportunity?: any;
  checkValidUsernameAction?: any;
  history?: any;
  match?: any;
  toggleModalReport?: Function;
}

export class UserSidebarPublic extends Component<JobOpeningItemPropTypes> {
  formRefContactInfo: any;
  formRefAbout: any;
  state = {
    isOpenContactInfoModal: false,
    isOpenEditContactInfoModal: false,
    isOpenAboutModal: false
  };

  toggleContactInfoModal = () => {
    const { isOpenContactInfoModal } = this.state;
    this.setState({
      isOpenContactInfoModal: !isOpenContactInfoModal
    });
  };

  toggleEditContactInfoModal = () => {
    const { userInfo } = this.props;
    const { isOpenEditContactInfoModal } = this.state;
    this.formRefContactInfo.props.form.setFieldsValue({ ...userInfo });
    this.setState({
      isOpenEditContactInfoModal: !isOpenEditContactInfoModal
    });
  };

  toggleAboutModal = () => {
    const { userInfo } = this.props;
    this.formRefAbout.props.form.setFieldsValue({ ...userInfo });
    this.setState({
      isOpenAboutModal: !this.state.isOpenAboutModal
    });
  };

  renderSections = () => {
    const { sections, userInfo } = this.props;
    return sections(userInfo);
  };

  handleContactInfoSubmit = (data: any) => {
    const { handleUpdateUserInfo, userInfo } = this.props;
    const isUpdatedUsername = data.username !== userInfo.username;
    handleUpdateUserInfo(data, isUpdatedUsername);
    this.toggleEditContactInfoModal();
  };

  handleAboutSubmit = (data: any) => {
    const { handleUpdateAbout } = this.props;
    handleUpdateAbout(data);
  };

  handleContactInfoEdit = () => {
    this.toggleEditContactInfoModal();
  };

  renderUserAbout = () => {
    const { userInfo } = this.props;
    if (!userInfo) {
      return null;
    }
    return (
      <GenericList
        data={[userInfo.about]}
        title="About"
        hasIcon={false}
        itemClassName="col-12"
        ListItemComponent={(props: any) => {
          const { data } = props;
          return (
            <ShowMoreText lines={5} more="Show more" less="Show less" anchorClass="">
              {data}
            </ShowMoreText>
          );
        }}
        WrapperComponent={(props: any) => {
          return <div className={styles['modified-container']}>{props.children}</div>;
        }}
      />
    );
  };

  renderVideoResume = () => {
    const { userInfo, toggleModalReport, match } = this.props;
    const dataVideoCover =
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
          ];
    const usernameOfUserLogin = localStorage.getItem('userTemp');
    return (
      <GenericList
        isPublicPage={true}
        isResumeVideo={true}
        isMyPublicProfile={
          (usernameOfUserLogin !== null ? JSON.parse(usernameOfUserLogin)['key'] : '') === match.params.username
        }
        toggleReportModal={toggleModalReport}
        title="Video Resume"
        iconClass="far fa-edit"
        hasIcon={false}
        classComponent="component-video-resume"
        data={dataVideoCover}
        itemClassName="col-12"
        listItemProps={{
          height: 'auto',
          isShowLogo: true,
          videoUploaded: userInfo ? userInfo.video_uploaded : false
        }}
        ListItemComponent={VideoPlayer}
      />
    );
  };

  render() {
    const {
      userInfo,
      handleUploadAvatar,
      logoutAction,
      handleUpdateUserInfo,
      handleUpdateJobTitle,
      handleUpdateStatusOpportunity
    } = this.props;
    const { isOpenContactInfoModal } = this.state;
    // console.log (userInfo);
    return (
      <div className={`sticky-top sticky-sidebar`}>
        <div className="box-information">
          <UserInfo
            userInfo={userInfo}
            handleUploadAvatar={handleUploadAvatar}
            handleChangeUserInfo={handleUpdateUserInfo}
            handleUpdateJobTitle={handleUpdateJobTitle}
            handleUpdateStatusOpportunity={handleUpdateStatusOpportunity}
            canEdit={false}
          />
        </div>

        <div className="box-other-information">
          <div className="block-abount">
            <h5 className="about-title" onClick={this.toggleContactInfoModal}>
              See Contact Info
            </h5>
            {(userInfo && userInfo.linkedin == '' && userInfo.facebook == '' && userInfo.twitter == '' && userInfo.instagram =='' && userInfo.portfolio == '') ? null : 
            <div className="list-socials">
              {userInfo && userInfo.linkedin ? (
                <a className="cus-social-link" href={userInfo.linkedin} target="_blank">
                  <i className={` socicon-linkedin`} />
                </a>
              ) : null}
              {userInfo && userInfo.facebook ? (
                <a className="cus-social-link" href={userInfo.facebook} target="_blank">
                  <i className={` socicon-facebook`} />
                </a>
              ) : null}
              {userInfo && userInfo.twitter ? (
                <a className="cus-social-link" href={userInfo.twitter} target="_blank">
                  {' '}
                  <i className={` socicon-twitter`} />
                </a>
              ) : null}
              {userInfo && userInfo.instagram ? (
                <a className="cus-social-link" href={userInfo.instagram} target="_blank">
                  <i className={` socicon-instagram`} />
                </a>
              ) : null}
              {userInfo && userInfo.portfolio ? (
                <a className="cus-social-link" href={userInfo.portfolio} target="_blank">
                  <i className={` socicon-internet`} />
                </a>
              ) : null}
            </div> }
          </div>
          {window.innerWidth < 768 && this.renderVideoResume()}

          {this.renderUserAbout()}

          {this.renderSections()}

          <Modal isOpen={isOpenContactInfoModal} toggleModal={this.toggleContactInfoModal}>
            <ContactInfo userInfo={userInfo} handleEditClick={this.handleContactInfoEdit} canEdit={false} />
          </Modal>
        </div>
      </div>
    );
  }
}
