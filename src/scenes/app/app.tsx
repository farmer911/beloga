import React, { Component } from 'react';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '../error/error.scene';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { RootReducer, rootSaga } from '../../ducks/combine';
import { createStore, applyMiddleware } from 'redux';
import { Header, Footer, ScrollTop, BackToTop, ProtectedRoute, LoadingIcon } from '../../commons/components';
import { configBackend } from '../../utils';
import { enhanceHeader, loadingWithConfig } from '../../HOCs';
import { RoutePaths } from '../../commons/constants';
import { NotificationService } from '../../services';
import * as scenes from './loadable-scenes';
import styles from './app.module.scss';

const HeaderWithAuth = enhanceHeader(Header);
const DefaultLoading = loadingWithConfig(LoadingIcon);

class App extends Component<any> {
  store: any;
  sagaMiddleware: any;
  constructor(props: any) {
    super(props);

    this.sagaMiddleware = createSagaMiddleware();

    this.store = createStore(RootReducer, applyMiddleware(this.sagaMiddleware));

    this.sagaMiddleware.run(rootSaga);
    configBackend();
    NotificationService.initialize();
  }

  renderRoutes = () => {
    return (
      <main className="main-page">
        <React.Suspense fallback={DefaultLoading}>
          <Switch>
            <Route path={RoutePaths.INDEX} exact component={scenes.LoadableHomeScene} />
            <ProtectedRoute
              redirectPath={RoutePaths.INDEX}
              path={RoutePaths.REGISTER}
              exact
              component={scenes.LoadableRegisterScene}
            />
            <ProtectedRoute
              redirectPath={RoutePaths.LOGIN}
              path={RoutePaths.USER}
              component={scenes.LoadableUserScene}
            />
            <Route path={RoutePaths.USER_PUBLIC.PATH} exact component={scenes.LoadablePublicScene} />
            <Route path={RoutePaths.LOGIN} exact component={scenes.LoadableLoginScene} />
            <Route path={RoutePaths.FORGOTPASSWORD} exact component={scenes.ForGotPassWord} />
            <Route path={RoutePaths.RESETPASS.PATH} exact component={scenes.ResetPass} />
            <Route path={RoutePaths.REGISTER_SOCIAL.PATH} exact component={scenes.LoadableRegisterScene} />
            <Route path={RoutePaths.ACTIVATE_LOGIN.PATH} exact component={scenes.LoadableLoginScene} />
            <Route path={RoutePaths.POLICY} exact component={scenes.LoadablePrivacyPolicyScene} />
            <Route path={RoutePaths.TERM_AND_CONDITION} exact component={scenes.LoadableTermsConditionsScene} />
            <Route path={RoutePaths.CONTACT_US} exact component={scenes.LoadableContactUsScene} />
            <Route path={RoutePaths.NOT_FOUND} exact component={scenes.LoadableNotFoundScene} />
            <Route path={RoutePaths.ACTIVATE_ACCOUNT.PATH} exact component={scenes.LoadableActivateAccountScene} />
            <Route path={RoutePaths.AFTER_REGISTER_SUCCESS} exact component={scenes.LoadabeAfterRegisterScene} />
            <Route path={RoutePaths.CHANGE_EMAIL_SUCCESS} exact component={scenes.LoadabeAfterRegisterScene} />
            <Route path={RoutePaths.BLOG} exact component={scenes.LoadableBlogScene} />
            <Route path={RoutePaths.HELP} exact component={scenes.LoadableHelpScene} />
            <Route path={RoutePaths.HELP_FAQ} exact component={scenes.LoadableHelpFAQsScene} />
            <Route path={RoutePaths.CAREERS} exact component={scenes.LoadableCareersScene} />
            <Route path={RoutePaths.CAREERS_DETAIL.PATH} exact component={scenes.LoadableCareersDetailScene} />
            <Route path={RoutePaths.VIDEO_TUTORIALS} exact component={scenes.LoadableHelpVideoTutorials} />
            <Route path={RoutePaths.BLOG_SINGLE.PATH} exact component={scenes.LoadableSingleBlogScene} />
            <Route path={RoutePaths.SOCIAL_CONNECT_SCENE} exact component={scenes.SocialConnectScene} />
            <Redirect to={RoutePaths.NOT_FOUND} />
          </Switch>
        </React.Suspense>
      </main>
    );
  };

  render() {
    return (
      <div className="app">
        <ErrorBoundary>
          <Provider store={this.store}>
            <BrowserRouter>
              <ScrollTop>
                <HeaderWithAuth />
                {this.renderRoutes()}
                <Footer />
                <BackToTop scrollStepInPx="50" delayInMs="16.66" />
              </ScrollTop>
            </BrowserRouter>
          </Provider>
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
