import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import styles from './google-social.module.scss';

const GOOGLE_API_CLIENT_ID = process.env.REACT_APP_GOOGLE_API_CLIENT_ID || '';
const googleApi = { clientId: GOOGLE_API_CLIENT_ID };

interface LoginFormPropTypes {
  handleLoginAction: any;
  buttonTitle: 'Login with Google';
}

export class GoogleSocial extends Component<LoginFormPropTypes, {}> {
  props: any;

  constructor(props: any) {
    super(props);

    this.responseGoogle = this.responseGoogle.bind(this);
  }

  responseGoogle(response: any) {
    const { handleLoginAction } = this.props;
    if (response && response.accessToken) {
      handleLoginAction({ response });
    }
  }

  render() {
    const { buttonTitle } = this.props;
    return (
      <GoogleLogin
        clientId={googleApi.clientId}
        className={`btn block btn--icon bg--googleplus type--uppercase ${styles['custom-google-button']}`}
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        autoLoad={false}
      >
        <span className="btn__text">
          <i className="socicon-googleplus" />
          {buttonTitle}
        </span>
      </GoogleLogin>
    );
  }
}
