import React, { Component, Fragment } from 'react';
import styles from './linkedin-social.module.scss';
import SocialButton from './SocialButton';

const LINKEDIN_API_CLIENT_ID = process.env.REACT_APP_LINKEDIN_API_CLIENT_ID || '';
const LinkedinApi = { clientId: LINKEDIN_API_CLIENT_ID };
const EXPRESS_APP_REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || '';

interface LoginFormPropTypes {
  handleLoginAction: any;
  buttonTitle: 'Login with LinkedIn';
}

export class LinkedinSocial extends Component<LoginFormPropTypes, {}> {
  props: any;

  constructor(props: any) {
    super(props);
  }

  requestOAuthToken = () => {
    const { handleLoginAction } = this.props;
    var oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_API_CLIENT_ID}&scope=r_liteprofile+r_emailaddress&state=123456&redirect_uri=${EXPRESS_APP_REDIRECT_URI}`;
    var width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;

    window.addEventListener(
      'message',
      event => {
        if (event.data.code) {
          handleLoginAction(event.data.code);
        }
      },
      false
    );

    window.open(
      oauthUrl,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    );
  };

  render() {
    const { buttonTitle } = this.props;

    return (
      <Fragment>
        <a
          className="btn-linkedin-social btn block btn--icon bg--linkedin type--uppercase"
          onClick={this.requestOAuthToken}
        >
          <span className="btn__text">
            <i className="socicon-linkedin linkedin-social_custom-icon-linkedin__npAF3" />
            {buttonTitle}
          </span>
        </a>
      </Fragment>
    );
  }
}
