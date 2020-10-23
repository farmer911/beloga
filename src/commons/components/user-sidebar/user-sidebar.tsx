import React, { Component } from 'react';
import { UserInfo } from '../user-info/user-info';
import styles from './user-sidebar.module.scss';
import { GenericList } from '../generic-list/generic-list';
import { ContactInfo } from '../contact-info/contact-info';
import { ContactInfoForm } from '../_forms/contact-info-form/contact-info-form';
import { AboutForm } from '../_forms/about-form/about-form';
import { createForm } from 'rc-form';
import { Modal } from '../modal/modal';
import ShowMoreText from 'react-show-more-text';
import { confirmAlert } from 'react-confirm-alert';
import { enhanceGenericList } from '../../../HOCs';
import { SkillListItem, InterestListItem, LanguageListItem } from '../_list-items';
import InterestForm from '../_forms/interest-form/interest-form';
import Languages from '../_forms/languages-form/languages-form';
import { VideoPlayer } from '../../../commons/components';

const EnhanceContactInfoForm = createForm()(ContactInfoForm);
const EnhanceAboutForm = createForm()(AboutForm);
const SkillForm = React.lazy(() => import('../../../commons/components/_forms/skill-form/skill-form'));
const EnhanceSkillForm = createForm()(SkillForm);
const EnhanceInterestForm = createForm()(InterestForm);
const EnhanceLanguagesForm = createForm()(Languages);
const EnhancedSkillList = enhanceGenericList(GenericList, SkillListItem);
const EnhancedInterestList = enhanceGenericList(GenericList, InterestListItem);
const EnhancedLanguagesList = enhanceGenericList(GenericList, LanguageListItem);

interface JobOpeningItemPropTypes {
  sections: any[];
  userInfo: any;
  logoutAction: any;
  handleUploadAvatar: any;
  handleUpdateUserInfo?: any;
  handleUpdateAbout?: any;
  handleUpdateSkill?: any;
  handleUpdateInterest?: any;
  handleUpdateLanguage?: any;
  handleUpdateJobTitle?: any;
  handleUpdateStatusOpportunity?: any;
  handleUpdateHiddenField?: any;
  checkValidUsernameAction?: any;
  history?: any;
  match?: any;
  toggleViewContactInfo?: Function;
  handleOpenUploadVideoResumeModal?: Function;
}

export class UserSidebar extends Component<JobOpeningItemPropTypes> {
  formRefContactInfo: any;
  formRefAbout: any;
  formRefSkill: any;
  formRefInterest: any;
  formRefLanguage: any;

  state = {
    isOpenContactInfoModal: false,
    isOpenEditContactInfoModal: false,
    isOpenAboutModal: false,
    isOpenSkillsModal: false,
    isOpenInterestModal: false,
    isOpenLanguageModal: false,
    reUserInfo: { skills: [] }
  };

  toggleContactInfoModal = () => {
    const { toggleViewContactInfo } = this.props;
    const { isOpenContactInfoModal } = this.state;
    this.setState(
      {
        isOpenContactInfoModal: !isOpenContactInfoModal
      },
      () => {
        if (typeof toggleViewContactInfo === 'undefined') {
          return;
        }
        toggleViewContactInfo();
      }
    );
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
    try {
      this.formRefAbout.props.form.setFieldsValue({ ...userInfo });
    } catch (err) {
      //console.log(err.message);
    }
    this.setState({
      isOpenAboutModal: !this.state.isOpenAboutModal
    });
  };
  toggleSkillsModal = () => {
    const { userInfo } = this.props;
    try {
      this.formRefSkill.props.form.setFieldsValue({ ...userInfo });
    } catch (err) {
      //console.log(err.message);
    }
    this.setState({
      isOpenSkillsModal: !this.state.isOpenSkillsModal
    });
  };
  toggleInterestModal = () => {
    const { userInfo } = this.props;
    try {
      this.formRefInterest.props.form.setFieldsValue({ ...userInfo });
    } catch (err) {
      //console.log(err.message);
    }
    this.setState({
      isOpenInterestModal: !this.state.isOpenInterestModal
    });
  };
  toggleLanguageModal = () => {
    const { userInfo } = this.props;
    try {
      this.formRefLanguage.props.form.setFieldsValue({ ...userInfo });
    } catch (err) {
      //console.log(err.message);
    }
    this.setState({
      isOpenLanguageModal: !this.state.isOpenLanguageModal
    });
  };

  renderSections = () => {
    const { sections } = this.props;
    return sections.map((Section, i) => {
      return <React.Fragment key={i}>{Section}</React.Fragment>;
    });
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
    this.setState({ isOpenAboutModal: !this.state.isOpenAboutModal });
  };
  handleClose = () => {
    this.setState({ isOpenAboutModal: !this.state.isOpenAboutModal });
  };
  handleCloseSkill = () => {
    // const {reUserInfo} = this.state;
    // const {userInfo} = this.props;
    this.setState({ isOpenSkillsModal: !this.state.isOpenSkillsModal });
  };
  handleCloseInterest = () => {
    this.setState({ isOpenInterestModal: !this.state.isOpenInterestModal });
  };
  handleCloseLanguage = () => {
    this.setState({ isOpenLanguageModal: !this.state.isOpenLanguageModal });
  };
  handleSkillSubmit = (data: any) => {
    const { handleUpdateSkill } = this.props;
    try {
      handleUpdateSkill(data);
    } catch (err) {
      //console.log(err.message);
    }
    this.setState({ isOpenSkillsModal: !this.state.isOpenSkillsModal });
  };
  handleInterestSubmit = (data: any) => {
    const { handleUpdateInterest } = this.props;
    try {
      handleUpdateInterest(data);
    } catch (err) {
      //console.log(err.message);
    }
    this.setState({ isOpenInterestModal: !this.state.isOpenInterestModal });
  };
  handleLanguageSubmit = (data: any) => {
    const { handleUpdateLanguage } = this.props;
    try {
      handleUpdateLanguage(data);
    } catch (err) {
      //console.log(err.message);
    }
    this.setState({ isOpenLanguageModal: !this.state.isOpenLanguageModal });
  };
  handleContactInfoEdit = () => {
    this.toggleEditContactInfoModal();
  };

  renderUserAbout = () => {
    const { userInfo } = this.props;
    const { isOpenAboutModal } = this.state;
    if (!userInfo) {
      return null;
    }
    return (
      <div>
        {!isOpenAboutModal && (
          <GenericList
            data={[userInfo.about]}
            title="About"
            hasIcon={true}
            iconClass="icon-edit"
            onIconClick={this.toggleAboutModal}
            itemClassName="col-12"
            ListItemComponent={(props: any) => {
              const { data } = props;
              return (
                <div>
                  <ShowMoreText lines={5} more="Show more" less="Show less" anchorClass="">
                    {data}
                  </ShowMoreText>
                </div>
              );
            }}
            WrapperComponent={(props: any) => {
              return <div className={styles['modified-container']}>{props.children}</div>;
            }}
          />
        )}
        <div className={isOpenAboutModal ? 'about-edit-form' : 'about-edit-form disable'}>
          <EnhanceAboutForm
            wrappedComponentRef={(inst: any) => (this.formRefAbout = inst)}
            handleSubmitAction={this.handleAboutSubmit}
            handleClose={this.handleClose}
            // title="Edit About"
          />
        </div>
      </div>
    );
  };
  renderUserSkills = () => {
    const { userInfo } = this.props;
    const { isOpenSkillsModal, reUserInfo } = this.state;
    if (!userInfo) {
      return null;
    }
    return (
      <div>
        {!isOpenSkillsModal && (
          <EnhancedSkillList
            title="Professional Skills"
            hasIcon={true}
            iconClass="icon-edit"
            onIconClick={this.toggleSkillsModal}
            classComponent="sidebar-skills"
            itemClassName="col-12"
            data={userInfo ? reUserInfo.skills : null}
            WrapperComponent={(props: any) => {
              return <div className={styles['listitem-container']}>{props.children}</div>;
            }}
          />
        )}
        <div className={isOpenSkillsModal ? 'about-edit-form' : 'about-edit-form disable'}>
          <EnhanceSkillForm
            title="Professional Skills"
            wrappedComponentRef={(inst: any) => (this.formRefSkill = inst)}
            handleSubmitAction={this.handleSkillSubmit}
            handleClose={this.handleCloseSkill}
            // title="Edit About"
          />
        </div>
      </div>
    );
  };
  renderUserInterest = () => {
    const { userInfo } = this.props;
    const { isOpenInterestModal } = this.state;
    if (!userInfo) {
      return null;
    }
    return (
      <div>
        {!isOpenInterestModal && (
          <EnhancedInterestList
            title="Personal Interests"
            hasIcon={true}
            iconClass="icon-edit"
            onIconClick={this.toggleInterestModal}
            classComponent="sidebar-interest"
            itemClassName="col-4"
            data={userInfo ? userInfo.interests : null}
            WrapperComponent={(props: any) => {
              return <div className={styles['listitem-container']}>{props.children}</div>;
            }}
          />
        )}
        <div className={isOpenInterestModal ? 'about-edit-form' : 'about-edit-form disable'}>
          <EnhanceInterestForm
            wrappedComponentRef={(inst: any) => (this.formRefInterest = inst)}
            handleSubmitAction={this.handleInterestSubmit}
            handleClose={this.handleCloseInterest}
            // title="Edit About"
          />
        </div>
      </div>
    );
  };
  renderUserLanguages = () => {
    const { userInfo } = this.props;
    const { isOpenLanguageModal } = this.state;
    if (!userInfo) {
      return null;
    }
    return (
      <div>
        {!isOpenLanguageModal && (
          <EnhancedLanguagesList
            title="Languages"
            hasIcon={true}
            iconClass="icon-edit"
            onIconClick={this.toggleLanguageModal}
            classComponent="sidebar-language"
            itemClassName="col-12"
            data={userInfo ? userInfo.languages : null}
            WrapperComponent={(props: any) => {
              return <div className={styles['listitem-container']}>{props.children}</div>;
            }}
          />
        )}
        <div className={isOpenLanguageModal ? 'about-edit-form' : 'about-edit-form disable'}>
          <EnhanceLanguagesForm
            wrappedComponentRef={(inst: any) => (this.formRefLanguage = inst)}
            handleSubmitAction={this.handleLanguageSubmit}
            handleClose={this.handleCloseLanguage}
            // title="Edit About"
          />
        </div>
      </div>
    );
  };

  renderVideoResume = () => {
    const { userInfo, handleOpenUploadVideoResumeModal } = this.props;
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
    return (
      <GenericList
        title="Video Resume"
        iconClass="far fa-edit"
        classComponent="component-video-resume"
        data={dataVideoCover}
        itemClassName="col-12"
        listItemProps={{
          height: 'auto',
          isShowLogo: false,
          videoUploaded: userInfo ? userInfo.video_uploaded : false
        }}
        ListItemComponent={VideoPlayer}
        hasIcon={false}
        isShowUploadButton={true}
        onPressUploadVideo={handleOpenUploadVideoResumeModal}
      />
    );
  };

  render() {
    const {
      userInfo,
      logoutAction,
      handleUploadAvatar,
      checkValidUsernameAction,
      handleUpdateUserInfo,
      handleUpdateJobTitle,
      handleUpdateStatusOpportunity,
      handleUpdateHiddenField
    } = this.props;
    const { isOpenContactInfoModal, isOpenEditContactInfoModal, isOpenAboutModal } = this.state;
    return (
      <div className={`sticky-top sticky-sidebar`}>
        <div className="box-information">
          <UserInfo
            userInfo={userInfo}
            handleUploadAvatar={handleUploadAvatar}
            handleChangeUserInfo={handleUpdateUserInfo}
            handleUpdateJobTitle={handleUpdateJobTitle}
            handleUpdateStatusOpportunity={handleUpdateStatusOpportunity}
            canEdit={true}
          />
        </div>

        <div className="box-other-information">
          <div className="block-abount">
            <h5 className="about-title okay-baby" onClick={this.toggleContactInfoModal}>
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
          {this.renderUserSkills()}
          {this.renderUserInterest()}
          {this.renderUserLanguages()}
          {/* <Modal isOpen={isOpenAboutModal} toggleModal={this.toggleAboutModal}> */}
          {/* {isOpenAboutModal && 
            <EnhanceAboutForm
              wrappedComponentRef={(inst: any) => (this.formRefAbout = inst)}
              handleSubmitAction={this.handleAboutSubmit}
              title="Edit About"
            />
          } */}
          {/* </Modal> */}

          {/* {this.renderSections()} */}

          <div className="block-logout-button">
            <a onClick={logoutAction} className={` logout-sidebar clickable type--uppercase`}>
              Log out
            </a>
            <Modal isOpen={isOpenContactInfoModal} toggleModal={this.toggleContactInfoModal}>
              <ContactInfo
                userInfo={userInfo}
                handleEditClick={this.handleContactInfoEdit}
                canEdit={true}
                handleUpdateHiddenField={handleUpdateHiddenField}
              />
            </Modal>
            <Modal
              isOpen={isOpenEditContactInfoModal}
              toggleModal={this.toggleEditContactInfoModal}
              size="big"
              existingModal={isOpenContactInfoModal}
            >
              <EnhanceContactInfoForm
                submitBtnTitle="Edit"
                title="Edit Contact Info"
                userInfo={userInfo}
                handleSubmit={this.handleContactInfoSubmit}
                wrappedComponentRef={(inst: any) => (this.formRefContactInfo = inst)}
                checkValidUsernameAction={checkValidUsernameAction}
                checkIsOpen={isOpenContactInfoModal}
              />
            </Modal>
          </div>
        </div>

        <div className="demo-wrapper" />
      </div>
    );
  }
}
