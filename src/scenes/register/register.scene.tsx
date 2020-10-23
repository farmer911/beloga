import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import {
  submitRegisterUserAction,
  checkValidEmailAction,
  checkValidUsernameAction,
  selectRegisterState
} from '../../ducks/register.duck';

import { facebookLoginAction, googleLoginAction, linkedinLoginAction } from '../../ducks/login.duck';

import { FormError, FacebookSocial, GoogleSocial, LoadingIcon, LinkedinSocial } from '../../commons/components';
import styles from './register.scene.module.scss';
import { RoutePaths } from '../../commons/constants';
import { loadingWithConfig } from '../../HOCs';

export const RegisterForm = React.lazy(() => import('../../commons/components/_forms/register-form/register-form'));
import { selectIsNewUser, selectIsUserInfoExists, selectUserInfo, getUserInfoAction } from '../../ducks/user.duck';
const REACT_APP_SIGNUP_SOCIAL_URL = process.env.REACT_APP_SIGNUP_SOCIAL_URL || '';
const DefaultLoading = loadingWithConfig(LoadingIcon, 'white', 'component-loading-wrapper', 30);

interface RegisterPropsType {
  submitRegisterUserAction: any;
  form: any;
  isRedirect: boolean;
  history: any;
  isLoading: boolean;
  errorFromServer: string;
  checkValidEmailAction: any;
  checkValidUsernameAction: any;
  facebookLoginAction: any;
  googleLoginAction: any;
  linkedinLoginAction: any;
  activateAction: any;
  selectActivateState: any;
  match: any;
  userInfo: any;
  isNewUser: boolean;
  isUserInfoExists: boolean;
  isAuthenticated: boolean;
}

class RegisterComponent extends Component<RegisterPropsType> {
  formRef: any;

  componentDidUpdate() {
    const { isRedirect, history } = this.props;
    if (isRedirect) {
      history.push(RoutePaths.AFTER_REGISTER_SUCCESS);
    }
  }

  enhanceRegisterForm = createForm()(RegisterForm);

  backgroundStyle = {
    background: `url('/images/login-background.jpg')`,
    opacity: 1
  };
  signUpWithSocialLinkedin = (code: string) => {
    const { linkedinLoginAction } = this.props;
    linkedinLoginAction({ code: code });
  };
  signUpWithSocialFacebook = (res: any) => {
    const { facebookLoginAction } = this.props;
    const token = res.response.accessToken || null;
    facebookLoginAction({ access_token: token });
  };
  signUpWithSocialGoogle = (res: any) => {
    const { googleLoginAction } = this.props;
    const token = res.response.accessToken || null;
    googleLoginAction({ access_token: token });
  };

  render() {
    const {
      submitRegisterUserAction,
      isLoading,
      errorFromServer,
      checkValidEmailAction,
      checkValidUsernameAction,
      facebookLoginAction,
      googleLoginAction,
      linkedinLoginAction
    } = this.props;
    const EnhanceRegisterForm = this.enhanceRegisterForm;
    return (
      <section className="imagebg login-page-section" data-overlay="5">
        <div className="background-image-holder"  />
        <div className="container-custom">
          <div className="row">
          <div className="login-scene">
            <div className="w-100 d-flex justify-content-center">
              <div className="col-md-12 col-lg-12">
                <h2 className="text-center">Join Belooga</h2>
                <br />
              </div>
            </div>
            <div className="w-100 d-flex justify-content-center">
              <div className={`col-12 col-sm-12${styles['special-padding']}`}>
                <FacebookSocial handleLoginAction={this.signUpWithSocialFacebook} buttonTitle="Sign up with Facebook" redirectUri={REACT_APP_SIGNUP_SOCIAL_URL}  />
                <GoogleSocial handleLoginAction={this.signUpWithSocialGoogle} buttonTitle="Sign up with Google" />
                <LinkedinSocial handleLoginAction={this.signUpWithSocialLinkedin} buttonTitle="Sign up with LinkedIn" />
                <hr className={styles['separate-hr']} data-title="OR" />
              </div>
            </div>

            {errorFromServer ? (
              <div className={styles['form-error']}>
                <FormError text={errorFromServer} />
              </div>
            ) : null} 
            <React.Suspense fallback={DefaultLoading}>
              <EnhanceRegisterForm
                isLoading={isLoading}
                actionSubmit={submitRegisterUserAction}
                errorFromServer={errorFromServer}
                wrappedComponentRef={(inst: any) => (this.formRef = inst)}
                actionCheckEmail={checkValidEmailAction}
                actionCheckUsername={checkValidUsernameAction}
              />
            </React.Suspense>
          </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...selectRegisterState(state)
  };
};

export default connect(
  mapStateToProps,
  {
    submitRegisterUserAction,
    checkValidEmailAction,
    checkValidUsernameAction,
    facebookLoginAction,
    googleLoginAction,
    linkedinLoginAction
  }
)(RegisterComponent);
