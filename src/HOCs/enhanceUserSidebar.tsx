import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  selectUserInfo,
  getUserInfoAction,
  updateUserContactInfoAction,
  uploadAvatarRequestAction,
  updateUserAboutAction,
  updateUserJobTitle,
  updateUserStatusOpportunity,
  updateUserHiddenField,
  updateUserSkillAction,
  updateUserInterestAction,
  updateUserLanguageAction,
  updateLocalUserInfo
} from '../ducks/user.duck';
import { logoutAction } from '../ducks/login.duck';
import { checkValidUsernameAction } from '../ducks/register.duck';
import { checkAuthAction, selectAuthState } from '../ducks/auth.duck';

const enhanceUserSidebar = (UserSidebarComponent: any) => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentDidMount() {
        const { getUserInfoAction, checkAuthAction, userInfo } = this.props;
        checkAuthAction();
        if (!userInfo) {
          getUserInfoAction();
        }
      }

      render() {
        const {
          isAuthenticated,
          userInfo,
          logoutAction,
          uploadAvatarRequestAction,
          updateUserContactInfoAction,
          checkValidUsernameAction,
          updateUserAboutAction,
          updateUserJobTitle,
          updateUserStatusOpportunity,
          updateUserHiddenField,
          updateUserSkillAction,
          updateUserInterestAction,
          updateUserLanguageAction
        } = this.props;
        if (!isAuthenticated) {
          return null;
        }
        return (
          <UserSidebarComponent
            userInfo={userInfo}
            logoutAction={logoutAction}
            handleUploadAvatar={uploadAvatarRequestAction}
            handleUpdateUserInfo={updateUserContactInfoAction}
            handleUpdateAbout={updateUserAboutAction}
            handleUpdateSkill={updateUserSkillAction}
            handleUpdateInterest={updateUserInterestAction}
            handleUpdateLanguage={updateUserLanguageAction}
            handleUpdateJobTitle={updateUserJobTitle}
            handleUpdateStatusOpportunity={updateUserStatusOpportunity}
            handleUpdateHiddenField={updateUserHiddenField}
            updateLocalUserInfo={updateLocalUserInfo}
            checkValidUsernameAction={checkValidUsernameAction}
            {...this.props}
          />
        );
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      ...selectAuthState(state),
      userInfo: selectUserInfo(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      {
        checkAuthAction,
        getUserInfoAction,
        logoutAction,
        uploadAvatarRequestAction,
        updateUserContactInfoAction,
        checkValidUsernameAction,
        updateUserAboutAction,
        updateUserSkillAction,
        updateUserInterestAction,
        updateUserLanguageAction,
        updateUserJobTitle,
        updateUserStatusOpportunity,
        updateUserHiddenField
      }
    )(Wrapper())
  );
};

export default enhanceUserSidebar;
