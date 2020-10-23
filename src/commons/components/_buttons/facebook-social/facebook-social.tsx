import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import styles from './facebook-social.module.scss';

const FB_API_CLIENT_ID = process.env.REACT_APP_FB_API_CLIENT_ID || '';
const facebookApi = { clientId: FB_API_CLIENT_ID };

interface LoginFormPropTypes {
  handleLoginAction: any;
  buttonTitle: 'Login with Facebook';
  redirectUri: any;
}

export class FacebookSocial extends Component<LoginFormPropTypes, {}> {
  props: any;

  constructor(props: any) {
    super(props);

    this.responseFacebook = this.responseFacebook.bind(this);
  }

  responseFacebook(response: any) {
    const { handleLoginAction } = this.props;
    if (response) {
      handleLoginAction({response});
    }
  }

  render() {
    const { buttonTitle, redirectUri } = this.props;
    return (
      <FacebookLogin
        redirectUri={redirectUri}
        appId={facebookApi.clientId}
        autoLoad={false}
        disableMobileRedirect={true}
        fields="name,email,picture"
        scope="public_profile,user_link"
        callback={this.responseFacebook}
        cssClass={`btn block btn--icon bg--facebook type--uppercase ${styles['custom-button']}`}
        icon="fa-facebook"
        textButton={buttonTitle}
      />
    );
  }
}
