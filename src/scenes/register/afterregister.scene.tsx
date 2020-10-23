import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './register.scene.module.scss';
import { RoutePaths } from '../../commons/constants';
import { loadingWithConfig } from '../../HOCs';
import { Link } from 'react-router-dom';
// export const RegisterForm = React.lazy(() => import('../../commons/components/_forms/register-form/register-form'));

// const DefaultLoading = loadingWithConfig(LoadingIcon, 'white', 'component-loading-wrapper', 30);

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
}

class AfterRegisterComponent extends Component<RegisterPropsType> {
  formRef: any;

  componentDidUpdate() {}

  backgroundStyle = {
    background: `url('/images/login-background.jpg')`,
    opacity: 1
  };

  render() {
    const {} = this.props;
    return (
      <section className="imagebg login-page-section" data-overlay="5">
        <div className="background-image-holder"  />
        <div className={`container ${styles.afterRegister}`}>
          <div className="row after-regiter">
            <div className="col-md-12 col-lg-12">
              <h2 className="text-center">Please check your email for a confirmation link to verify your account.</h2>
            </div>
            <div className="w-100 d-flex justify-content-center">
              <Link className="type--fine-print" to={RoutePaths.LOGIN}>
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = () => {
  return {};
};

const mapStateToProps = (state: any) => {
  return {
    ...state
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AfterRegisterComponent);
