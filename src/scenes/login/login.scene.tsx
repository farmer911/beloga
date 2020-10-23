import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { Link } from 'react-router-dom';
import { selectIsNewUser, selectIsUserInfoExists, selectUserInfo, getUserInfoAction } from '../../ducks/user.duck';
import { FormError, LoadingIcon, FacebookSocial, GoogleSocial, LinkedinSocial } from '../../commons/components';
import QueryString from 'query-string';
import { LinkedInPopUp } from '../../commons/components/_buttons/linkedin-social/LinkedInPopup';

import {
  loginAction,
  selectLoginState,
  facebookLoginAction,
  googleLoginAction,
  linkedinLoginAction,
  activateAction,
  selectActivateState,
  logoutAction,
  messageConfirm,
  resetError,
  resendEmail
} from '../../ducks/login.duck';
import styles from './login.scene.module.scss';
import { RoutePaths } from '../../commons/constants';
import { UserType } from '../../commons/types/view-model';
import { selectCanAccessLogin, selectAuthState } from '../../ducks/auth.duck';
import { loadingWithConfig } from '../../HOCs';
import { NotificationService } from '../../services';

const LoginForm = React.lazy(() => import('../../commons/components/_forms/login-form/login-form'));
const DefaultLoading = loadingWithConfig(LoadingIcon, 'white', 'component-loading-wrapper', 30);

interface LoginSceneProps {
  loginAction: any;
  isRedirect: boolean;
  history: any;
  isLoading: boolean;
  errorFromServer: string;
  facebookLoginAction: any;
  googleLoginAction: any;
  linkedinLoginAction: any;
  canAccessPage: boolean;
  isAuthenticated: boolean;
  isInvalidToken: boolean;
  activateAction: any;
  selectActivateState: any;
  match: any;
  userInfo: any;
  isNewUser: boolean;
  isUserInfoExists: boolean;
  logoutAction: any;
  sendEmailResult: any;
  sendEmailError: any;
  isLoadingSendMail: boolean;
  resetError: Function;
  resendEmail: Function;
}

interface LoginSceneStates {
  userSend: any;
}

const enhanceLoginForm = createForm()(LoginForm);

class LoginScene extends Component<LoginSceneProps, LoginSceneStates> {
  messageConfirm = 'Your email address has not been confirmed. Please click the link in the email we sent.';

  backgroundStyle = {
    background: `url('/images/login-background.jpg')`,
    opacity: 1
  };

  constructor(props: LoginSceneProps) {
    super(props);
    this.state = {
      userSend: {}
    };
  }

  componentWillMount() {
    const {
      activateAction,
      match,
      history,
      isAuthenticated,
      isNewUser,
      isUserInfoExists,
      userInfo,
      logoutAction
    } = this.props;
    if (match.params.key) {
      logoutAction();
      activateAction(match.params);
    }
    if (isAuthenticated) {
      if (isUserInfoExists) {
        isNewUser
          ? history.push(RoutePaths.USER_UPDATE_PROFILE.getPath(userInfo.username))
          : history.push(RoutePaths.USER_PROFILE.getPath(userInfo.username));
      }
    }
  }

  componentDidMount() {
    const { history, isAuthenticated, isNewUser, isUserInfoExists, userInfo } = this.props;
    if (isAuthenticated) {
      if (isUserInfoExists) {
        isNewUser
          ? history.push(RoutePaths.USER_UPDATE_PROFILE.getPath(userInfo.username))
          : history.push(RoutePaths.USER_PROFILE.getPath(userInfo.username));
      }
    }
  }

  componentWillUpdate(nextProps: any) {
    const { history, isNewUser, isUserInfoExists, userInfo } = nextProps;
    if (isUserInfoExists) {
      !userInfo.submitted && userInfo
        ? history.push(RoutePaths.USER_UPDATE_PROFILE.getPath(userInfo.username))
        : history.push(RoutePaths.USER_PROFILE.getPath(userInfo.username));
    }
  }

  componentDidUpdate(prevProps: LoginSceneProps) {
    if (
      this.props.isLoadingSendMail !== prevProps.isLoadingSendMail &&
      !this.props.isLoadingSendMail &&
      Object.keys(this.props.sendEmailResult).length > 0
    ) {
      this.props.history.push(RoutePaths.AFTER_REGISTER_SUCCESS);
    }
    if (
      this.props.isLoadingSendMail !== prevProps.isLoadingSendMail &&
      !this.props.isLoadingSendMail &&
      Object.keys(this.props.sendEmailError).length > 0
    ) {
      NotificationService.notify('Email is not found');
    }
  }

  signInWithSocialLinkedin = (code: string) => {
    const { linkedinLoginAction, history } = this.props;
    linkedinLoginAction({ code: code });
  };
  signInWithSocialFacebook = (res: any) => {
    const { facebookLoginAction, history } = this.props;
    const token = res.response.accessToken || null;
    facebookLoginAction({ access_token: token });
  };
  signInWithSocialGoogle = (res: any) => {
    const { googleLoginAction, history } = this.props;
    const token = res.response.accessToken || null;
    googleLoginAction({ access_token: token });
  };

  onResendEmail = () => {
    const { username } = this.state.userSend;
    const { resendEmail } = this.props;
    resendEmail(username);
  };

  onUsernameForResend = (value: any) => {
    this.setState({
      userSend: value
    });
  };

  renderReSendEmail = (error: string): any => {
    const { isLoadingSendMail, sendEmailError } = this.props;
    return (
      <div
        className="row"
        style={{ backgroundColor: 'rgba(220, 114, 19, 0.85)', color: '#fff', padding: 20, margin: 0, borderRadius: 5 }}
      >
        <span className="col-md-12 col-sm-10 col-xs-10">{error}</span>
        <span
          className="col-12"
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={this.onResendEmail}
        >
          {isLoadingSendMail ? (
            DefaultLoading
          ) : (
            <>
              <i className="fas fa-paper-plane" style={{ textDecoration: 'none' }} /> Click here to resend it
            </>
          )}
        </span>
      </div>
    );
  };

  componentWillUnmount() {
    this.props.resetError();
  }

  render() {
    const EnhanceLoginForm = enhanceLoginForm;
    const {
      loginAction,
      isLoading,
      errorFromServer,
      facebookLoginAction,
      googleLoginAction,
      linkedinLoginAction,
      isAuthenticated
    } = this.props;
    const params = QueryString.parse(window.location.search);
    if ((params.code || params.error) && params.state != 'facebookdirect') {
      return <LinkedInPopUp />;
    }
    return !isAuthenticated ? (
      <section className="text-center imagebg login-page-section" data-overlay="5">
        <div className="background-image-holder" />
        <div className="container-custom">
          <div className="row">
            <div className="col-sm-8 col-md-6 col-lg-5 col-xs-12 login-scene">
              <h2 className={`com-form-title-login ${styles['margin-top']}`}>Login to continue</h2>
              <div className={`${styles['social-container-button']}`}>
                <FacebookSocial handleLoginAction={this.signInWithSocialFacebook} buttonTitle="Login with Facebook" redirectUri="https://www.belooga.com/login" />
                <GoogleSocial handleLoginAction={this.signInWithSocialGoogle} buttonTitle="Login with Google" />
                <LinkedinSocial handleLoginAction={this.signInWithSocialLinkedin} buttonTitle="Login with LinkedIn" />
              </div>
              <hr /> 
              <p className="lead">Sign in or create an account</p>
              {errorFromServer && errorFromServer !== this.messageConfirm ? (
                <div className={styles['form-error']}>
                  <FormError text={`${errorFromServer}`} />
                </div>
              ) : null}
              {errorFromServer && errorFromServer === this.messageConfirm
                ? this.renderReSendEmail(errorFromServer)
                : null}
              <React.Suspense fallback={DefaultLoading}>
                <EnhanceLoginForm
                  handleSubmitAction={loginAction}
                  isLoading={isLoading}
                  onUsernameForResend={this.onUsernameForResend}
                />
              </React.Suspense>

              <span className="type--fine-print block">
                Dont have an account yet? <Link to="/register">Create account</Link>
              </span>
              <span className="type--fine-print block">
                Forgot your password? <Link to="/forgot-password">Recover account</Link>
              </span>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <React.Fragment />
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...selectLoginState(state),
    isNewUser: selectIsNewUser(state),
    isUserInfoExists: selectIsUserInfoExists(state),
    userInfo: selectUserInfo(state),
    ...selectAuthState(state),
    activateState: selectActivateState(state),
    sendEmailResult: state.LoginReducer.sendEmailResult,
    sendEmailError: state.LoginReducer.sendEmailError,
    isLoadingSendMail: state.LoginReducer.isLoadingSendMail
  };
};

export default connect(
  mapStateToProps,
  {
    loginAction,
    facebookLoginAction,
    googleLoginAction,
    linkedinLoginAction,
    activateAction,
    logoutAction,
    resetError,
    resendEmail
  }
)(LoginScene);
