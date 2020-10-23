import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { ProtectedRoute } from '../../commons/components';
import { RoutePaths } from '../../commons/constants';
import { selectUserInfo, getUserInfoAction } from '../../ducks/user.duck';
import { connect } from 'react-redux';

export const ProfileScene = React.lazy(() => import('./profile/profile.scene'));
export const UpdateUserScene = React.lazy(() => import('./update-user/update-user.scene'));
export const AccountSettingScene = React.lazy(() => import('./account-setting/account-setting.scene'));
export const SearchUserResultScene = React.lazy(() => import('../search-result/search_result.scene'));
class UserScene extends Component<any> {
  render() {
    return (
      <Switch>
        <ProtectedRoute
          redirectPath={RoutePaths.INDEX}
          path={RoutePaths.USER_SEARCHING.PATH}
          component={SearchUserResultScene}
        />
        <ProtectedRoute
          redirectPath={RoutePaths.INDEX}
          path={RoutePaths.USER_PROFILE.PATH}
          exact
          component={ProfileScene}
        />
        <ProtectedRoute
          redirectPath={RoutePaths.INDEX}
          path={RoutePaths.USER_UPDATE_PROFILE.PATH}
          component={UpdateUserScene}
        />
        <ProtectedRoute
          redirectPath={RoutePaths.INDEX}
          path={RoutePaths.USER_ACCOUNT_SETTING.PATH}
          component={AccountSettingScene}
        />
      </Switch>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    userInfo: selectUserInfo(state)
  };
};

export default connect(
  mapStateToProps,
  { getUserInfoAction }
)(UserScene);
