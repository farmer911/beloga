import React from 'react';
import SocialLogin from 'react-social-login';
import styles from './linkedin-social.module.scss';

const Button = ({ children, triggerLogin, ...props }: {children:any, triggerLogin:any}) => (
  <a onClick={triggerLogin} {...props} className="btn block btn--icon bg--linkedin type--uppercase">
    <span className="btn__text">
        <i className={`socicon-linkedin ${styles['custom-icon-linkedin']}`}></i>
        { children }
    </span>
  </a>
);

export default SocialLogin(Button);