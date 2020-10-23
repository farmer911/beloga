import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { checkAuthAction, selectAuthState } from '../ducks/auth.duck';
import { selectUserInfo, getUserInfoAction, selectIsUserInfoExists } from '../ducks/user.duck';
import { logoutAction } from '../ducks/login.duck';
import { userInfo } from 'os';

const enhanceHeader = (HeaderComponent: any) => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentWillMount() {
        const { getUserInfoAction, checkAuthAction } = this.props;
        checkAuthAction();
        getUserInfoAction();
      }

      componentWillUpdate(nextProps: any) {
        const { isAuthenticated, isUserInfoExists, location, history } = nextProps;
        if (isAuthenticated && !isUserInfoExists) {
          getUserInfoAction();
        }
        const pathname = location.pathname;
        const isLogout = localStorage.getItem('is_logout');
        if (!isAuthenticated && !isLogout && pathname.search('/user/') !== -1) {
          const publicPage = pathname.replace('user', 'public');
          history.replace(publicPage);
        } else if (isLogout) {
          localStorage.removeItem('is_logout');
        }
      }

      render() {
        const { isAuthenticated, userInfo, logoutAction, history } = this.props;
        return (
          <HeaderComponent
            history={history}
            isAuthenticated={isAuthenticated}
            userInfo={userInfo}
            logoutAction={logoutAction}
          />
        );
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      ...selectAuthState(state),
      userInfo: selectUserInfo(state),
      isUserInfoExists: selectIsUserInfoExists(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      { checkAuthAction, logoutAction, getUserInfoAction }
    )(Wrapper())
  );
};

export default enhanceHeader;
