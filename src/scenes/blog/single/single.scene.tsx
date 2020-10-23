import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Truncate from 'react-truncate';

import styles from './Single.scene.module.scss';
import { selectAuthState } from '../../../ducks/auth.duck';
import { RoutePaths } from '../../../commons/constants';

import { getBlogDetailAction, selectBlogDetail, selectIsLoading, selectIsSlug } from '../../../ducks/blog-detail.duck';

import { LoadingIcon, IconButton } from '../../../commons/components';
import sassVariable from '../../../styles/variables.module.scss';
import { loadingWithConfig } from '../../../HOCs';
const DefaultLoading = loadingWithConfig(LoadingIcon);

import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  GooglePlusIcon,
  LinkedinIcon,
  TwitterIcon
} from 'react-share';

interface SingleSceneProps {
  singleBlog: any;
  getBlogDetailAction: any;
  selectIsLoading: any;
  document: any;
  match: any;
  isLoading: boolean;
  history?:any;
  isSlug: boolean;
  selectIsSlug: any;
}

class SingleScene extends Component<SingleSceneProps> {
  node: any;
  state = {
    isOpenShareSocial: false
  };
  constructor(props: SingleSceneProps) {
    super(props);
  }

  componentWillMount() {
    document.body.classList.add('blog-single-scene');
    const { match, getBlogDetailAction } = this.props;
    getBlogDetailAction(match.params.blogslug);
  }

  componentWillUnmount() {
    document.body.classList.remove('blog-single-scene');
  }
  componentDidMount() {
    const {isSlug, history} = this.props;
    if(!isSlug) {
      history.replace(RoutePaths.NOT_FOUND);
    }
  }
  componentDidUpdate() {
    const { isOpenShareSocial } = this.state;
    if (isOpenShareSocial) {
      document.addEventListener('mousedown', this.handleClickOutModal);
    } else {
      document.removeEventListener('mousedown', this.handleClickOutModal);
    }
  }

  handleOpenUserOption = () => {
    this.setState({
      isOpenShareSocial: !this.state.isOpenShareSocial
    });
  };

  handleClickOutModal = (event: any) => {
    if (this.node.contains(event.target)) {
      return;
    }
    this.setState({
      isUserOptionOpen: false
    });
  };

  renderShareSocial = () => {
    return (
      <React.Fragment>
        <div className="social-share-box">
          <a className={`social-menu`} onClick={this.handleOpenUserOption}>
            <IconButton className="justify-content-end" iconClass="icon-share" buttonName="Share on Social" />
            <ul
              className={`dropdown-menu dropdown__content dropdown__content} ${
                this.state.isOpenShareSocial ? ' show' : ''
              }`}
            >
              <li>
                <FacebookShareButton url={window.location.href} className={'social-share-button'}>
                  <FacebookIcon size={32} round /> <span className={`share-label`}>Share on Facebook</span>
                </FacebookShareButton>
              </li>
              <li>
                <GooglePlusShareButton url={window.location.href} className={'social-share-button'}>
                  <GooglePlusIcon size={32} round /> <span className={`share-label`}>Share on Google+</span>
                </GooglePlusShareButton>
              </li>
              <li>
                <LinkedinShareButton url={window.location.href} className={'social-share-button'}>
                  <LinkedinIcon size={32} round /> <span className={`share-label`}>Share on Linkedin</span>
                </LinkedinShareButton>
              </li>
              <li>
                <TwitterShareButton url={window.location.href} className={'social-share-button'}>
                  <TwitterIcon size={32} round /> <span className={`share-label`}>Share on Twitter</span>
                </TwitterShareButton>
              </li>
            </ul>
          </a>
        </div>
      </React.Fragment>
    );
  };

  renderSingleBlog() {
    const { singleBlog } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-12">
            <span className="category-label color-1">{singleBlog.category}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12">
            <div className="single-blog-info">
              <div className="author-group">
                <span className="author-title">Posted by:</span>
                <img className="author-avatar" src={singleBlog.user.image_url} />
                <span className="author-name">{singleBlog.user.username}</span>
              </div>
              {this.renderShareSocial()}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12">
            <p className="single-blog-summary">{singleBlog.summary}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12">
            <div className="single-blog-content" dangerouslySetInnerHTML={{ __html: singleBlog.content }} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12">
            <div className="share-social-block">
              <p>Share this:</p>
              <ul className="share-social-bottom-page">
                <li>
                  <FacebookShareButton url={window.location.href} className={'social-share-button'}>
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                </li>
                <li>
                  <GooglePlusShareButton url={window.location.href} className={'social-share-button'}>
                    <GooglePlusIcon size={40} round />
                  </GooglePlusShareButton>
                </li>
                <li>
                  <LinkedinShareButton url={window.location.href} className={'social-share-button'}>
                    <LinkedinIcon size={40} round />
                  </LinkedinShareButton>
                </li>
                <li>
                  <TwitterShareButton url={window.location.href} className={'social-share-button'}>
                    <TwitterIcon size={40} round />
                  </TwitterShareButton>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentWillReceiveProps(nextProps:any) {
    const {isSlug} = nextProps;
    if(isSlug !== this.props.isSlug && isSlug == false) {
      this.props.history.replace(RoutePaths.NOT_FOUND);
    }
  }
  
  render() {
    const { isLoading, singleBlog, isSlug} = this.props;
    return isLoading ? (
      DefaultLoading
    ) : singleBlog ? (
      <div className="blog-single-page" ref={node => (this.node = node)}>
        <section className="header-single-section">
          <div className="container">
            <div className="imagebg header-img" data-overlay="4">
              <div
                className="background-image-holder"
                style={{ backgroundImage: `url(${singleBlog.image_url})`, opacity: 1 }}
              >
                <img alt="background" src={singleBlog.image_url} />
              </div>
              <div className="container pos-vertical-center">
                <div className="row text-center justify-content-center">
                  <div className="col-md-12">
                    <h1>{singleBlog && singleBlog.title ? singleBlog.title : 'Belooga Blog'}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="blog-single-section">{this.renderSingleBlog()}</section>
      </div>
    ) : (
      <div className="blog-single-page">
        <section className="header-single-section">
          <div className="container">
            <div className="imagebg header-img" data-overlay="4">
              <div
                className="background-image-holder"
                style={{ backgroundImage: 'url("/images/blog/banner-blog.png")', opacity: 1 }}
              >
                <img alt="background" src="/images/blog/banner-blog.png" />
              </div>
              <div className="container pos-vertical-center">
                <div className="row text-center justify-content-center">
                  <div className="col-md-12">
                    <h1>Belooga Blog</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="blog-single-section">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md=12">
                <p className="not-found-blog">Blog not found.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...selectAuthState(state),
    singleBlog: selectBlogDetail(state),
    isLoading: selectIsLoading(state),
    isSlug: selectIsSlug(state)
  };
};

export default connect(
  mapStateToProps,
  { getBlogDetailAction }
)(SingleScene);
