import React, { Component, Fragment } from 'react';
import styles from './social-form.module.scss'
import { facebookConnectAction, linkedinConnectAction, twitterConnectAction, instagramConnectAction } from '../../../../ducks/social.duck';
import { getUserInfoAction } from '../../../../ducks/user.duck'
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';

const FB_API_CLIENT_ID = process.env.REACT_APP_FB_API_CLIENT_ID || '';
const EXPRESS_APP_REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || '';
const LINKEDIN_API_CLIENT_ID = process.env.REACT_APP_LINKEDIN_API_CLIENT_ID || '';
const FACEBOOK_API_CLIENT_ID = { clientId: FB_API_CLIENT_ID };
const INSTAGRAM_API_CLIENT_ID = process.env.REACT_APP_INSTAGRAM_API_CLIENT_ID || '';
const APP_REDIRECT_URI = process.env.REACT_APP_URI || '';
const SOCIAL_URL = process.env.REACT_APP_SOCIAL_URL || '';
const API_TWITTER_CALLBACK_URL = process.env.REACT_APP_TWITTER_API_CALLBACK_URL || '';

interface SocialFormPorps {
    facebookConnectAction: any;
    linkedinConnectAction: any;
    twitterConnectAction: any;
    instagramConnectAction: any;
    getUserInfoAction: any;
}

class SocialForm extends Component<SocialFormPorps> {
    constructor(props: any) {
        super(props);
    }
    state = {
        access_token: ''
    };

    connectWithSocialFacebook = (res: any) => {
        const { facebookConnectAction, getUserInfoAction } = this.props;
        const token = res.accessToken || null;
        facebookConnectAction(token);
        getUserInfoAction();
    };
    connectWithSocialLinkedin = (code: any) => {
        const { linkedinConnectAction } = this.props;
        let token = { code: code }
        linkedinConnectAction(token);
    };
    connectWithSocialTwitter = (access_token: any, access_token_secret: any) => {
        const { twitterConnectAction, getUserInfoAction } = this.props;
        twitterConnectAction({ access_token: access_token, token_secret: access_token_secret });
        getUserInfoAction();
    };
    connectWithSocialInstagram = (access_token: any) => {
        const { instagramConnectAction, getUserInfoAction } = this.props;
        instagramConnectAction(access_token);
        getUserInfoAction();
    };
    onFailure = (error: any) => {
        alert(error);
    };

    requestOAuthTokenTwitter = () => {
        let width = 450,
            height = 730,
            left = window.screen.width / 2 - width / 2,
            top = window.screen.height / 2 - height / 2;
        let popup = window.open(
            SOCIAL_URL,
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
        if (popup) {
            popup.onload = () => {
                popup!.location.href = API_TWITTER_CALLBACK_URL;
                let id = setInterval(async () => {
                    if (popup!.location.href.indexOf(`${APP_REDIRECT_URI}/?access_token=`) !== -1) {
                        let url = new URL(popup!.location.href)
                        let url_search = new URLSearchParams(url.search)
                        let access_token = url_search.get('access_token')
                        let token_secret = url_search.get('access_token_secret')
                        this.connectWithSocialTwitter(access_token, token_secret)
                        clearInterval(id)
                        await popup!.close()
                    }
                }, 500)
            }
        }
    }

    requestOAuthTokenLinkedin = () => {
        let oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_API_CLIENT_ID}&scope=r_liteprofile+r_emailaddress&state=123456&redirect_uri=${APP_REDIRECT_URI}`;
        let width = 450,
            height = 730,
            left = window.screen.width / 2 - width / 2,
            top = window.screen.height / 2 - height / 2;

        let popup = window.open(
            SOCIAL_URL,
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
        if (popup) {
            popup.onload = () => {
                popup!.location.href = oauthUrl;
                let id = setInterval(async () => {
                    if (popup!.location.href.indexOf(`${APP_REDIRECT_URI}/?code=`) !== -1) {
                        let code = new URL(popup!.location.href).searchParams.get('code')
                        this.connectWithSocialLinkedin(code)
                        clearInterval(id);
                        await popup!.close()
                    }
                }, 500)
            };
        }
    };

    requestOAuthTokenInstagram = () => {
        let oauthUrl = `https://api.instagram.com/oauth/authorize/?client_id=${INSTAGRAM_API_CLIENT_ID}&redirect_uri=${APP_REDIRECT_URI}&response_type=token`;
        let width = 450,
            height = 730,
            left = window.screen.width / 2 - width / 2,
            top = window.screen.height / 2 - height / 2;

        let popup = window.open(
            SOCIAL_URL,
            'Instagram',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
            width +
            ', height=' +
            height +
            ', top=' +
            top +
            ', left=' +
            left
        );
        if (popup) {
            popup.onload = async () => {
                popup!.location.href = oauthUrl;
                let id = setInterval(() => {
                    if (popup!.location.href.indexOf(`${APP_REDIRECT_URI}/#access_token=`) !== -1) {
                        let access_token = popup!.location.href.split('=').pop();
                        this.connectWithSocialInstagram(access_token)
                        clearInterval(id);
                        popup!.close()
                    }
                }, 500)
            };
        }
    };
    render() {
        return (
            <div className={styles['social-group']}>
                <span onClick={this.requestOAuthTokenInstagram}><i className="fab fa-instagram" id={styles['instagram']}></i></span>
                <span onClick={this.requestOAuthTokenTwitter}><i className="fab fa-twitter-square" id={styles['twitter']}></i></span>
                <span onClick={this.requestOAuthTokenLinkedin}><i className="fab fa-linkedin" id={styles['linkedin']}></i></span>
                <span>
                    <FacebookLogin
                        redirectUri={EXPRESS_APP_REDIRECT_URI}
                        appId={FACEBOOK_API_CLIENT_ID.clientId}
                        autoLoad={false}
                        disableMobileRedirect={true}
                        fields="name,email,picture"
                        scope="public_profile,user_link"
                        callback={this.connectWithSocialFacebook}
                        cssClass={styles['facebook']}
                        icon="fa fa-facebook-official"
                        textButton=""
                    />
                </span>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {}
}

export default connect(
    mapStateToProps,
    {
        facebookConnectAction,
        linkedinConnectAction,
        twitterConnectAction,
        instagramConnectAction,
        getUserInfoAction
    }
)(SocialForm);