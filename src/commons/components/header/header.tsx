import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './header.module.scss';
import { RoutePaths } from '../../constants';
import { confirmAlert } from 'react-confirm-alert';
import SearchBar from '../search-bar/search-bar';

interface HeaderStateTypes {
  isMenuOpen: boolean;
  isUserOptionOpen: boolean;
}

export class Header extends Component<any, HeaderStateTypes> {
  node: any;
  nodeDropdown: any;
  state = {
    isMenuOpen: false,
    isUserOptionOpen: false
  };

  handleLogoutClick = () => {
    const { logoutAction } = this.props;
    this.setState({
      isUserOptionOpen: false
    });
    logoutAction();
  };

  handleOpenUserOption = () => {
    this.setState({
      isUserOptionOpen: !this.state.isUserOptionOpen
    });
  };

  toggleMenu = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    });
    if (window.innerWidth < 768) {
      this.setState({
        isUserOptionOpen: !this.state.isUserOptionOpen
      });
    }
  };

  handleClickOutModal = (event: any) => {
    try {
      if (window.innerWidth >= 768 && !this.nodeDropdown.contains(event.target)) {
        this.setState({
          isUserOptionOpen: false,
          isMenuOpen: false
        });
      } else if (!this.node.contains(event.target)) {
        this.setState({
          isUserOptionOpen: false,
          isMenuOpen: false
        });
      }
    } catch (err) {
      //console.log('Error: ', err);
    }
  };

  hideDropdown = () => {
    this.setState({
      isUserOptionOpen: false
    });
    if (window.innerWidth < 768) {
      this.setState({
        isMenuOpen: false
      });
    }
  };

  componentDidUpdate(nextProps: any) {
    const { isUserOptionOpen } = this.state;
    if (isUserOptionOpen) {
      document.addEventListener('mousedown', this.handleClickOutModal);
    } else {
      document.removeEventListener('mousedown', this.handleClickOutModal);
    }
    // Redirect to user profile if view public profile of self
    // const pathname = window.location.pathname;
    // if (pathname && pathname.search('/public/') !== -1) {
    //   const name = pathname.replace('/public/', '');
    //   if (name) {
    //     const usernameInArr = name.split('?');
    //     const username = usernameInArr[0];
    //     const { userInfo, history } = this.props;
    //     if (userInfo && username && userInfo.username == username) {
    //       window.location.href = RoutePaths.USER_PROFILE.getPath(userInfo.username);
    //     }
    //   }
    // }
  }

  componentWillReceiveProps(nextProps: any) {
    const { userInfo } = nextProps;
    const resumeVideoProgressing = localStorage.getItem('resume_video_progressing');
    const experienceVideoProgressing = localStorage.getItem('experience_video_progressing');
    const educationVideoProgressing = localStorage.getItem('education_video_progressing');
    // Should check and call action check status uploaded
    if (userInfo && userInfo.video_uploaded && resumeVideoProgressing && resumeVideoProgressing === 'yes') {
      localStorage.removeItem('resume_video_progressing');
      this.alertCompletedVideo('Video Resume');
    } else if (
      userInfo &&
      userInfo.job_video_uploaded &&
      experienceVideoProgressing &&
      experienceVideoProgressing === 'yes'
    ) {
      localStorage.removeItem('experience_video_progressing');
      this.alertCompletedVideo('Experience Video');
    } else if (
      userInfo &&
      userInfo.school_video_uploaded &&
      educationVideoProgressing &&
      educationVideoProgressing === 'yes'
    ) {
      localStorage.removeItem('education_video_progressing');
      this.alertCompletedVideo('Education Video');
    }
  }

  renderAuthenticatedMenu = () => {
    const { isUserOptionOpen } = this.state;
    const { userInfo, isAuthenticated } = this.props;
    const containerClass = isAuthenticated ? 'belooga-container' : 'belooga-container hide';
    return (
      <React.Fragment>
        <li className={`nav-item ${containerClass}`} style={{ padding: '5px 0px' }}>
          {userInfo && userInfo.submitted ? (
            <div className={`nav-link dropdown ${isUserOptionOpen ? 'show' : ''}`}>
              {window.innerWidth >= 768 && (
                <a className={`${styles['clickable']}`} onClick={this.handleOpenUserOption}>
                  <span>My Profile</span>
                  <i className="stack-down-open" />
                </a>
              )}
              <ul
                ref={node => (this.nodeDropdown = node)}
                className={`dropdown-menu dropdown__content ${styles['dropdown-menu']} ${
                  isUserOptionOpen ? ' show' : ''
                  }`}
              >
                <li className={styles['li-username']}>
                  <NavLink
                    onClick={this.hideDropdown}
                    exact
                    className="nav-link"
                    to={RoutePaths.USER_PROFILE.getPath(userInfo && userInfo.username)}
                  >
                    Signed in as <br />
                    <strong>{userInfo && userInfo.email}</strong>
                  </NavLink>
                </li>
                <li className={styles['li-second']}>
                  <NavLink
                    onClick={this.hideDropdown}
                    exact
                    className="nav-link"
                    to={RoutePaths.USER_PROFILE.getPath(userInfo && userInfo.username)}
                  >
                    Edit my profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={this.hideDropdown}
                    exact
                    className="nav-link"
                    to={RoutePaths.USER_ACCOUNT_SETTING.getPath(userInfo && userInfo.username)}
                  >
                    Account settings
                  </NavLink>
                </li>
                {userInfo && userInfo.status_opportunity ? (
                  <li>
                    <NavLink
                      onClick={this.hideDropdown}
                      exact
                      className="nav-link"
                      to={RoutePaths.USER_PUBLIC.getPath(userInfo && userInfo.username)}
                    >
                      View my public profile
                    </NavLink>
                  </li>
                ) : null}
                <li>
                  <a onClick={this.handleLogoutClick} className="nav-link">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          ) : null}
          {userInfo && !userInfo.submitted ? (
            <a onClick={this.handleLogoutClick} className="nav-link">
              Logout
            </a>
          ) : null}
        </li>
      </React.Fragment>
    );
  };

  renderMenu = () => {
    const { isAuthenticated } = this.props;
    const containerClass = isAuthenticated ? 'belooga-container hide' : 'belooga-container';
    return (
      <React.Fragment>
        <li className={`nav-item ${containerClass}`}>
          <NavLink
            exact={true}
            activeClassName="active"
            className="nav-link"
            to={RoutePaths.LOGIN}
            onClick={this.hideDropdown}
          >
            Login
          </NavLink>
        </li>
        <li className={`nav-item ${containerClass}`}>
          <NavLink
            to={RoutePaths.REGISTER}
            exact={true}
            activeClassName="active"
            className="nav-link"
            onClick={this.hideDropdown}
          >
            Register
          </NavLink>
        </li>
      </React.Fragment>
    );
  };

  alertCompletedVideo = (message: string) => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Your {message} has uploaded successfully.</p>
            <div className="confirm-button">
              <a onClick={onClose} className="confirm-ok-button">
                Ok
              </a>
            </div>
          </div>
        );
      }
    });
  };

  render() {
    const { isMenuOpen } = this.state;
    const { isAuthenticated } = this.props;
    const containerClass = isAuthenticated === undefined ? 'belooga-container hide' : 'belooga-container';
    return (
      <header
        ref={ref => {
          this.node = ref;
        }}
      >
        <nav className={`${styles['nav']} navbar fixed-top navbar-expand-md navbar-light`}>
          <div className="container">
            <NavLink
              onClick={() => {
                this.setState({
                  isMenuOpen: false
                });
              }}
              exact={true}
              activeClassName="active"
              to={RoutePaths.INDEX}
              className="nav-link nav-link-logo"
            >
              <img className={`header-logo ${styles['logo']}`} alt="logo" src="/images/logo-big.png" />
            </NavLink>
            <button
              className="navbar-toggler no-margin-top"
              type="button"
              style={{ position: 'absolute', right: 20, top: 20 }}
              onClick={this.toggleMenu}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              style={{
                position: isMenuOpen ? 'absolute' : undefined,
                top: 70,
                right: 0,
                width: isMenuOpen ? '100%' : undefined
              }}
            >
              <div className={`collapse navbar-collapse ${containerClass} ${isMenuOpen ? 'show' : ''}`}>
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                  <li className="nav-item active" />
                </ul>
                <ul
                  id="menu-sub-horizontal"
                  className="navbar-nav my-auto my-2 my-lg-0 menu-horizontal"
                  style={{ display: 'inline-flex' }}
                >
                  {/* <li className="nav-item">
                    <NavLink exact={true} activeClassName="active" className="nav-link" to={RoutePaths.INDEX}>
                      Home
                    </NavLink>
                  </li> */}
                  <div className="search-visible">
                    {isAuthenticated && window.location.pathname === RoutePaths.USER_SEARCHING.PATH && (
                      <li>
                        <SearchBar history={this.props.history} defaultWidth={'380px'} />
                      </li>
                    )}
                  </div>
                  {isAuthenticated ? this.renderAuthenticatedMenu() : this.renderMenu()}
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <div>
          {isAuthenticated && window.location.pathname === RoutePaths.USER_SEARCHING.PATH && (
            <SearchBar history={this.props.history} defaultWidth={'380px'} />
          )}
        </div>
      </header>
    );
  }
}
