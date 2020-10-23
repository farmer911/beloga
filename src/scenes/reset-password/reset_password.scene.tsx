import React, { Component } from 'react';
import { connect } from 'react-redux';

import { RoutePaths, RegexConst } from '../../commons/constants';
import { Link } from 'react-router-dom';
import { api } from '@belooga/belooga-ts-sdk';
import { resetPassword, resetPasswordConfirm } from '../../ducks/login.duck';
import styles from './reset_password.scene.module.scss';
import { LoadingIcon } from '../../commons/components';
import { loadingWithConfig } from '../../HOCs';
import sassVariable from '../../styles/variables.module.scss';

import {
  loginActionSuccess
} from '../../ducks/login.duck';

const DefaultLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'component-loading-wrapper', 60);
class ResetPass extends Component<any>{
  backgroundStyle = {
    background: `url('/images/login-background.jpg')`,
    opacity: 1
  };
  state = {
    password1: '',
    password2: '',
    uid: '',
    token: '',
    timestamp: '',
    error: {
      numberic: '',
      characters: '',
      common: '',
      empty: '',
      special_char: '',
    },
    error2: {
      empty: '',
      match: ''
    },
    isSubmit: false,
    isSuccess: false,
    isError: false
  }

  componentWillMount() {
    const { match } = this.props;
    this.setState({
      uid: match.params.uid,
      token: match.params.token,
      timestamp: match.params.timestamp
    })
  }

  onChangePass = (e: any) => {
    let { error } = this.state;
    const conditionOneLetter = RegexConst.SAME_CHARACTER_REGEX;
    const conditionPassword = RegexConst.ONLY_NUMERIC_REGEX;
    const conditionMissSpecial = RegexConst.MISS_CHARACTER_SPECIAL;
    if (e.target.value.length < 8) {
      error.characters = 'Password must be at least 8 characters';
      // this.setState({error})
    } else { error.characters = '' }
    if (e.target.value.trim() === '') {
      error.empty = 'Password is required.'
      // this.setState({error})
    } else { error.empty = '' }
    if (e.target.value.match(conditionOneLetter)) {
      error.common = 'Password is too common.'
      // this.setState({error})
    } else { error.common = '' }
    if (e.target.value.match(conditionPassword)) {
      error.numberic = "Password input can't be entirely numeric!"
      // this.setState({error})
    } else { error.numberic = '' }
    if (!e.target.value.match(conditionMissSpecial)) {
      error.special_char = "Password must contain a special character."
    } else { error.special_char = '' }
    if (e.target.value.trim() !== '' && e.target.value.length >= 8
      && !e.target.value.match(conditionOneLetter)
      && !e.target.value.match(conditionPassword)
      && e.target.value.match(conditionMissSpecial)
      && !e.target.value.match(conditionPassword)) {
      this.setState({ password1: e.target.value, error: {} })
    } else { this.setState({ error }) }


  }
  onChangePass2 = (e: any) => {
    let { password1, error2 } = this.state;
    if (e.target.value !== password1) {
      error2.match = 'Password confirmation does not match!'

    } else { error2.match = '' }
    if (e.target.value.trim() === '') {
      error2.empty = 'Password confirmation is required.'

    } else { error2.empty = '' }
    if (e.target.value.trim() !== '' && e.target.value === password1) {
      this.setState({ password2: e.target.value, error2: {} })
    } else { this.setState({ error2 }) }
  }
  onSubmitEmail = () => {
    let { password1, password2, uid, token, timestamp, error, error2 } = this.state;
    const { loginActionSuccess } = this.props;

    let data = {
      new_password1: password1,
      new_password2: password2,
      uid: uid,
      token: token,
      timestamp: timestamp
    }
    if (password1 === '') {
      error.empty = 'Password is required.'
    } else { error.empty = '' }
    if (password2 === '') {
      error2.empty = 'Password confirmation is required.'
    } else { { error2.empty = '' } }
    if (password1 !== '' && password2 !== '' && (!error.characters || error.characters == '')
      && (!error.common || error.common == '') && (!error.empty || error.empty == '')
      && (!error.numberic || error.numberic == '') && (!error.special_char || error.special_char == '')
      && (!error2.empty || error2.empty == '') && (!error2.match || error2.match == '')) {
      this.setState({ isSubmit: true });
      resetPasswordConfirm(data).then(rs => {
        if (rs.status === 200) {
          this.setState({ isSuccess: true, isError: false })
          loginActionSuccess()
        }
        if (rs.status === 400) {
          this.setState({ isError: true })
        }
        this.setState({ isSubmit: false })
      })
    } else { this.setState({ error, error2 }) }

  }
  render() {
    const { error, error2, isSubmit, isSuccess, isError } = this.state;
    return (
      <React.Fragment>
        <section className="reset-password-content height-100 text-center imagebg login-page-section">
          <div className="background-image-holder" />
          <div className="container pos-vertical-center">
            <div className="row">
              {isSuccess ?
                <div style={{ width: '100%' }}>
                  <h2 className="login.scene_margin-top__awwmm" style={{ color: "#000", margin: "auto"}}>
                    Success! Your password was changed.
                  </h2>
                  <Link style={{ color: "#000" }} to="/login">Return login page</Link>
                </div>
                : <div className="col-md-7 col-lg-5">
                  <h2 className="login.scene_margin-top__awwmm" style={{ color: "#000", marginBottom: "30px" }}>Create new password</h2>
                  {isError && <h2 className="login.scene_margin-top__awwmm" style={{ color: "red" }}>Something was wrong!</h2>}
                  <div className="col-md-12 text-left" style={{ padding: 0 }}>
                    <label style={{ color: "#000" }}>New password*</label>
                    <input type="password" placeholder="Enter new password" onChange={(e) => { this.onChangePass(e) }} />
                    {error.empty && <p style={{ color: "red", marginBottom: 0 }}>{error.empty}</p>}
                    {error.characters && <p style={{ color: "red", marginBottom: 0 }}>{error.characters}</p>}
                    {error.common && <p style={{ color: "red", marginBottom: 0 }}>{error.common}</p>}
                    {error.numberic && <p style={{ color: "red", marginBottom: 0 }}>{error.numberic}</p>}
                    {error.special_char && <p style={{ color: "red", marginBottom: 0 }}>{error.special_char}</p>}
                  </div>
                  <div className="col-md-12 text-left" style={{ padding: 0, marginTop: "10px" }}>
                    <label style={{ color: "#000" }}>Confirm new password*</label>
                    <input type="password" placeholder="Enter password confirmation" onChange={(e) => { this.onChangePass2(e) }} />
                    {error2.empty && <p style={{ color: "red", marginBottom: 0 }}>{error2.empty}</p>}
                    {error2.match && <p style={{ color: "red", marginBottom: 0 }}>{error2.match}</p>}
                  </div>
                  {isSubmit && <div>{DefaultLoading}</div>}
                  <button className="btn btn--primary type--uppercase"
                    style={{ color: "#000", marginTop: 20, width: '100%' }}
                    onClick={this.onSubmitEmail}
                  >submit
                      </button>
                </div>}

            </div>
          </div>
        </section>
      </React.Fragment>
    );
  };
}
const mapStateToProps = (state: any) => {
  return {
    // isNewUser: selectIsNewUser(state),
    // isUserInfoExists: selectIsUserInfoExists(state),
    // userInfo: selectUserInfo(state),
  };
};
// export default ResetPass;
export default connect(
  mapStateToProps,
  { loginActionSuccess }
)(ResetPass);
