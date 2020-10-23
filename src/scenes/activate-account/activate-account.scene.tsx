import React, { Component } from 'react';
import { connect } from 'react-redux';
import { activateAction, selectActivateState, selectIsActivateLoading } from '../../ducks/login.duck';
import styles from './activate-account.scene.module.scss';
import { LoadingIcon } from '../../commons/components';
import { loadingWithConfig } from '../../HOCs';

interface ActivateAccountSceneProps {
  activateAction: any;
  isRedirect: boolean;
  history: any;
  match: any;
  activateState: boolean;
  isLoading: boolean;
  errorFromServer: string;
}

const DefaultLoading = loadingWithConfig(LoadingIcon);

class ActivateAccountScene extends Component<ActivateAccountSceneProps> {
  componentWillMount() {
    const { activateAction, match, activateState } = this.props;
    activateAction(match.params);
  }

  renderSuccess = () => (
    <div className="main-container">
      <section className="text-center height-30">
        <div className="container pos-vertical-center">
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <h1>Activation Successful</h1>
            </div>
          </div>
        </div>
      </section>
      <section className={`bg--secondary ${styles['content-body']}`}>
        <div className="container">
          <div className="row justify-content-center no-gutters">
            <div className="col-md-10 col-lg-8">
              <div className="alert bg--success">
                <div className="alert__body">
                  <span>Thank you for registering and activating your account with Belloga. Please click on Continue to login page.</span>
                </div>
              </div>
            </div>
            <div className={`col-md-10 col-lg-8 ${styles['align-right']}`}>
              <a href="/login" className={`btn btn--primary ${styles['continue']}`}>Continue</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  renderFail = () => (
    <div className="main-container">
      <section className="text-center height-30">
        <div className="container pos-vertical-center">
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <h1>Activation Failed</h1>
            </div>
          </div>
        </div>
      </section>
      <section className={`bg--secondary ${styles['content-body']}`}>
        <div className="container">
          <div className="row justify-content-center no-gutters">
            <div className="col-md-10 col-lg-8">
              <div className="alert bg--error">
                <div className="alert__body">
                  <span>Sorrry, The activation code is invalid.</span>
                </div>
              </div>
            </div>
            <div className={`col-md-10 col-lg-8 ${styles['align-right']}`}>
              <a href="/register" className={`btn btn--primary ${styles['continue']}`}>Register</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  render() {
    const { isLoading, activateState } = this.props;
    return ( 
      isLoading ? DefaultLoading : (activateState ? this.renderSuccess() : this.renderFail())
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoading: selectIsActivateLoading(state),
    activateState: selectActivateState(state)
  };
};

export default connect(
  mapStateToProps,
  {
    activateAction
  }
)(ActivateAccountScene);
