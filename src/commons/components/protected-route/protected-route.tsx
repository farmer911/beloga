import React, { Component } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkAuthAction, selectAuthState } from '../../../ducks/auth.duck';
import { RoutePaths } from '../../constants';

interface ProtectedRoutePropTypes extends RouteProps {
  redirectPath: string;
  checkAuthAction?: any;
  isAuthenticated?: boolean;
  isInit?: boolean;
  isTokenInvalid?: boolean;
}

class ProtectedRoute extends Component<ProtectedRoutePropTypes, any> {
  constructor(props: any) {
    super(props);
  }

  componentwillMount() {
    const { checkAuthAction } = this.props;
    checkAuthAction();
  }

  render() {
    const { isAuthenticated, component, path, redirectPath, exact, isTokenInvalid } = this.props;
    const _path = Array.isArray(path) ? path.join('') : path;
    if (isAuthenticated === undefined) {
      return null;
    }
    switch (_path) {
      case RoutePaths.LOGIN:
      case RoutePaths.REGISTER: {
        return (
          <div>
            {isAuthenticated ? (
              <Redirect from={_path} to={redirectPath} />
            ) : (
              <Route path={path} exact={exact} component={component} />
            )}
          </div>
        );
      }
      default: {
        return (
          <div>
            {isAuthenticated ? (
              <Route path={path} exact={exact} component={component} />
            ) : (
              <Redirect from={_path} to={redirectPath} />
            )}
          </div>
        );
      }
    }
  }
}

const mapStateToProps = (state: any, ownProps: ProtectedRoutePropTypes) => ({
  ...selectAuthState(state),
  ...ownProps
});

export default connect(
  mapStateToProps,
  { checkAuthAction }
)(ProtectedRoute);
