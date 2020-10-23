import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectUserInfo, getUserPublicAction } from '../ducks/user-public.duck';
import { checkValidUsernameAction } from '../ducks/register.duck';

const enhanceUserSidebarPublic = (UserSidebarComponent: any) => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentDidMount() {
        const { match, getUserPublicAction, userInfo } = this.props;
        if (!userInfo) {
          getUserPublicAction(match.params.username);
        }
      }

      render() {
        const { userInfo, checkValidUsernameAction } = this.props;
        return (
          <UserSidebarComponent
            userInfo={userInfo}
            checkValidUsernameAction={checkValidUsernameAction}
            {...this.props}
          />
        );
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      userInfo: selectUserInfo(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      {
        getUserPublicAction,
        checkValidUsernameAction
      }
    )(Wrapper())
  );
};

export default enhanceUserSidebarPublic;
