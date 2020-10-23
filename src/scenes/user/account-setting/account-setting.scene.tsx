import React, { Component, Fragment, ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  GenericList,
  SkillListItem,
  LanguageListItem,
  InterestListItem,
  UserSidebar,
  LoadingIcon
} from '../../../commons/components';
import {
  updateUserContactInfoAction,
  uploadAvatarRequestAction,
  updateUserEmailAction,
  updateUserPasswordAction,
  selectErrorChangePassword,
  selectIsRedirect,
  selectIsChangeEmailSuccess,
  selectErrorFromServer,
  selectUserInfo,
  getUserInfoAction,
  userDeleteAccountAction
} from '../../../ducks/user.duck';
import { checkValidEmailAction, checkValidUsernameAction } from '../../../ducks/register.duck';
import { createForm } from 'rc-form';
import styles from './account-setting.scene.module.scss';
import { RoutePaths } from '../../../commons/constants';
import { UserType } from '../../../commons/types/view-model';
import { enhanceGenericList, enhanceUserSidebar, loadingWithConfig } from '../../../HOCs';
import { updateUserMapper } from '../../../utils/mapper';
import SocialForm from '../../../commons/components/_forms/social-form/social-form';
import { confirmAlert } from 'react-confirm-alert';

export const PersonalForm = React.lazy(() => import('../../../commons/components/_forms/personal-form/personal-form'));
export const ChangePasswordForm = React.lazy(() =>
  import('../../../commons/components/_forms/change-password-form/change-password-form')
);

const DefaultLoading = loadingWithConfig(LoadingIcon, 'white', 'component-loading-wrapper', 30);

interface AccountSettingComponentProps {
  history: any;
  updateUserContactInfoAction: any;
  updateUserEmailAction: any;
  updateUserPasswordAction: any;
  getErrorChangePassword: any;
  errorChangePassword: any;
  isRedirect: boolean;
  isLoading: boolean;
  isChangeEmailSuccess: boolean;
  uploadAvatarRequestAction: any;
  userInfo?: UserType;
  getUserInfoAction: any;
  checkValidEmailAction: any;
  checkValidUsernameAction: any;
  errorFromServer: string;
  userDeleteAccountAction: any;
}

const EnhanceUserSidebar = enhanceUserSidebar(UserSidebar);
const EnhancedSkillList = enhanceGenericList(GenericList, SkillListItem);
const EnhancedLanguageList = enhanceGenericList(GenericList, LanguageListItem);
const EnhancedInterestList = enhanceGenericList(GenericList, InterestListItem);

const sidebarSections = [
  <EnhancedSkillList
    title="Professional Skills"
    classComponent="sidebar-skills"
    itemClassName="col-12"
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

class AccountSettingScene extends Component<AccountSettingComponentProps> {
  constructor(props: any) {
    super(props);
  }

  state = {
    currentStep: 1,
    isInit: false,
    containerClass: 'belooga-container hide'
  };
  totalStep = 2;
  formRefPersonal: any;
  formRefPassword: any;

  componentWillMount() {
    const { getUserInfoAction } = this.props;
    getUserInfoAction();
  }

  componentWillUpdate(nextProps: any) {
    const { history, location, userInfo, isChangeEmailSuccess } = nextProps;
    if (isChangeEmailSuccess) {
      history.push(RoutePaths.CHANGE_EMAIL_SUCCESS);
    } else {
      const pathname = location.pathname;
      const validPathname = RoutePaths.USER_ACCOUNT_SETTING.getPath(userInfo.username);
      if (userInfo && pathname !== validPathname) {
        history.replace(RoutePaths.NOT_FOUND);
      }
      this.formRefPersonal.props.form.setFieldsValue({ ...updateUserMapper.apiToForm(userInfo) });
    }
  }

  enhancePersonalForm = createForm()(PersonalForm);
  enhanceChangePasswordForm = createForm()(ChangePasswordForm);

  confirmRemoveAccount = () => {
    const _seft = this;
    try {
      confirmAlert({
        customUI: (data: any) => {
          const { onClose } = data;
          return (
            <div className="custom-ui-confirm confirm-remove-account">
              <a className="custom-close-confirm" onClick={onClose}>
                <img src="/images/icons/close-modal.png" />
              </a>
              <p className="confirm-message">
                If you do not think you will use Belooga again and would like your account deleted, we can take care of
                this for you. Keep in mind that you will not be able to reactivate your account or retrieve any of the
                content or information you have deleted.
              </p>
              <div className="confirm-button">
                <a onClick={_seft.removeAccount.bind(_seft, onClose)} className="confirm-ok-button">
                  DELETE ACCOUNT
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

  removeAccount = (callback: any) => {
    const { userDeleteAccountAction } = this.props;
    userDeleteAccountAction();
    callback();
  };

  render() {
    const {
      userInfo,
      updateUserContactInfoAction,
      updateUserEmailAction,
      updateUserPasswordAction,
      errorChangePassword,
      isLoading,
      isChangeEmailSuccess,
      errorFromServer,
      checkValidEmailAction,
      checkValidUsernameAction
    } = this.props;
    const EnhancePersonalForm = this.enhancePersonalForm;
    const EnhanceChangePasswordForm = this.enhanceChangePasswordForm;
    return (
      <div>
        <div className={`container ${styles['account-setting-form']}`}>
          <div className="main-content main-content-account-setting">
            <div className={`left-content `}>
              <EnhanceUserSidebar sections={sidebarSections} userInfo={userInfo} />
            </div>

            <div className={`right-content ${styles['account-setting-content']}`}>
              <div className={`container}`}>
                <React.Suspense fallback={DefaultLoading}>
                  <h3 className="com-form-title">Personal Information</h3>
                  <EnhancePersonalForm
                    userInfo={userInfo}
                    isLoading={isLoading}
                    actionSubmit={updateUserContactInfoAction}
                    actionSubmitEmail={updateUserEmailAction}
                    errorFromServer={errorFromServer}
                    wrappedComponentRef={(inst: any) => (this.formRefPersonal = inst)}
                    actionCheckEmail={checkValidEmailAction}
                    checkValidUsernameAction={checkValidUsernameAction}
                  />
                  <h3 className="com-form-title">Connect Your Socials</h3>
                  <SocialForm/>
                  {userInfo && !userInfo.is_social ? (
                    <Fragment>
                      <h3 className={`com-form-title ${styles['password-title-group']}`}>Change Password</h3>
                      <EnhanceChangePasswordForm
                        userInfo={userInfo}
                        isLoading={isLoading}
                        actionSubmit={updateUserPasswordAction}
                        errorFromServer={errorFromServer}
                        wrappedComponentRef={(inst: any) => (this.formRefPassword = inst)}
                        errorChangePassword={errorChangePassword}
                      />
                    </Fragment>
                  ) : null}
                  <div className="block-remove-account">
                    <a onClick={this.confirmRemoveAccount} className={` logout-sidebar clickable type--uppercase`}>
                      Remove Account
                    </a>
                  </div>
                </React.Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isRedirect: selectIsRedirect(state),
    errorFromServer: selectErrorFromServer(state),
    userInfo: selectUserInfo(state),
    errorChangePassword: selectErrorChangePassword(state),
    isChangeEmailSuccess: selectIsChangeEmailSuccess(state)
  };
};

export default connect(
  mapStateToProps,
  {
    updateUserContactInfoAction,
    updateUserEmailAction,
    uploadAvatarRequestAction,
    updateUserPasswordAction,
    getUserInfoAction,
    checkValidEmailAction,
    checkValidUsernameAction,
    userDeleteAccountAction
  }
)(AccountSettingScene);
