import React, { Component } from 'react';
require('./forgot_password.modules.scss');
import { RoutePaths, RegexConst } from '../../commons/constants';
import { Link } from 'react-router-dom';
import { api } from '@belooga/belooga-ts-sdk';
import { resetPassword } from '../../ducks/login.duck';
import { loadingWithConfig } from '../../HOCs';
import { LoadingIcon } from '../../commons/components';
import sassVariable from '../../styles/variables.module.scss';

const DefaultLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'component-loading-wrapper', 60);
class ForGotPassWord extends Component {
  backgroundStyle = {
    background: `url('/images/login-background.jpg')`,
    opacity: 1,
    marginTop: 90,
    maxHeight: 768
  };
  state = {
    email: '',
    error: '',
    isSuccess: false,
    isLoading: false,
    isError: false
  };
  renderError = () => {
    const { error } = this.state;
    return <div className="custom-form-error text-danger">{error}</div>;
  };
  checkError = () => {
    const { error } = this.state;
    return error !== '';
  };
  onChangeEmail = (e: any) => {
    const emailCondition = RegexConst.EMAIL_REGREX;
    if (!e.target.value.match(emailCondition)) {
      this.setState({ error: 'Email invalid!' });
    }
    if (e.target.value.trim() === '') {
      this.setState({ error: 'Email is required!' });
    }
    if (e.target.value.trim() !== '' && e.target.value.match(emailCondition)) {
      this.setState({ error: '' });
    }
    this.setState({ email: e.target.value });
  };
  onSubmitEmail = () => {
    const { email } = this.state;
    if (email === '') {
      this.setState({ error: 'Email is required!' });
    } else {
      this.setState({ isLoading: true, error: '' });
      resetPassword(email).then(rs => {
        let _status = rs.status;
        if (_status === 200) {
          this.setState({ isSuccess: true, isLoading: false, isError: false });
        } else {
          this.setState({ isLoading: false, isError: true });
        }
      });
    }
  };
  render() {
    let checkError = this.checkError();
    let { isSuccess, isLoading, isError } = this.state;
    return (
      <React.Fragment>
        <section className="text-center min-height-forgot">
          <div className="background-image-holder"/>
          <div className="container pos-vertical-center">
            <div className="row">
              {isSuccess && (
                <h2 className="login.scene_margin-top__awwmm" style={{ color: '#000', margin: 'auto' }}>
                  Success! Please check your email!
                </h2>
              )}
              {!isSuccess && (
                <div className="col-md-7 col-lg-5 login-scene">
                  {isLoading && <div>{DefaultLoading}</div>}
                  <h2 className="login.scene_margin-top__awwmm" style={{ margin: 'auto' }}>
                    Forgot password
                  </h2>
                  {isError && (
                    <h5 className="login.scene_margin-top__awwmm" style={{ color: 'red', margin: 'auto' }}>
                      This e-mail address does not exist.
                    </h5>
                  )}
                  <div className="col-md-12 text-left" style={{ padding: 0 }}>
                    <label style={{ color: 'white' }}>Email*</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      onChange={e => {
                        this.onChangeEmail(e);
                      }}
                    />
                    {this.renderError()}
                  </div>
                  <button
                    className="btn btn--primary type--uppercase"
                    style={{ color: 'white', marginTop: 20, width: '100%' }}
                    onClick={this.onSubmitEmail}
                  >
                    submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
export default ForGotPassWord;
