import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Truncate from 'react-truncate';

import styles from './blog.scene.module.scss';
import { selectAuthState } from '../../ducks/auth.duck';
import { RoutePaths } from '../../commons/constants';

import { fetchBlogAction, selectListBlog, selectIsLoading } from '../../ducks/blog.duck';
import { blogFeatureAction, selectListFeatureBlog, selectIsLoadingFeature } from '../../ducks/blog-feature.duck';

import { LoadingIcon } from '../../commons/components';
import sassVariable from '../../styles/variables.module.scss';
import { loadingWithConfig } from '../../HOCs';
const DefaultLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'component-loading-wrapper', 30);
const HeaderLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'component-loading-wrapper', 50);

interface BlogSceneProps {
  listBlog: any;
  data: any;
  fetchBlogAction: any;
  selectIsLoading: any;
  document: any;
  isLoading: boolean;
  blogFeature: any;
  blogFeatureAction: any;
  selectListFeatureBlog: any;
  isLoadingFeature: boolean;
}

class BlogScene extends Component<BlogSceneProps> {
  constructor(props: BlogSceneProps) {
    super(props);
  }

  componentWillMount() {
    document.body.classList.add('blog-scene');
    const { fetchBlogAction, blogFeatureAction } = this.props;
    fetchBlogAction();
    blogFeatureAction();
  }
  componentWillUnmount() {
    document.body.classList.remove('blog-scene');
  }

  renderBlogItem() {
    const { listBlog } = this.props;
    // let categories: any;
    // if (listBlog && listBlog.results && listBlog.results.length) {
    //   categories = listBlog.results.map((a: any, index: number) => categories.push({a.category: index}));
    // }
    // console.log(categories);
    return listBlog && listBlog.results && listBlog.results.length ? (
      listBlog.results.map((item: any, index: any) => (
        <div key={index.toString()} className="col-12 col-sm-6 col-md-4">
          <div className="blog-box">
            <div className="project-thumb">
              <a href={RoutePaths.BLOG_SINGLE.getPath(item.slug)}>
                <img className="blog-thumbnail" src={item.image_url} />
              </a>
            </div>
            <div className="blog-box-content">
              <span className="category-label color-1">{item.category}</span>
              <h2 className="title-blog">
                <a href={RoutePaths.BLOG_SINGLE.getPath(item.slug)}>{item.title}</a>
              </h2>
              <p className="description-blog">
                <Truncate lines={2} ellipsis={<span>...</span>}>
                  {item.summary}
                </Truncate>
              </p>
              <div className="author-group">
                <img className="author-avatar" src={item.user.image_url} />
                <span className="author-name">{item.user.username}</span>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="col-12 col-md-12">
        <p className="component-no-results">Blog not found.</p>
      </div>
    );
  }

  renderFeatureBlog = () => {
    const { blogFeature } = this.props;
    let featureTitle = <span>Belooga Blog</span>;
    let featureImage = '/images/blog/banner-blog.png';
    if (blogFeature && blogFeature.results && blogFeature.results.length > 0) {
      const blog = blogFeature.results;
      featureTitle = <a href={RoutePaths.BLOG_SINGLE.getPath(blog[0].slug)}>{blog[0].title}</a>;
      featureImage = blog[0].image_url;
      return (
        <a href={RoutePaths.BLOG_SINGLE.getPath(blog[0].slug)} className="blog-a-link">
        <div className="imagebg header-img" data-overlay="4">
          <div className="background-image-holder" style={{ backgroundImage: `url("${featureImage}")`, opacity: 1 }}>
            <img alt="background" src={featureImage} />
          </div>
          <div className="container pos-vertical-center">
            <div className="row text-center justify-content-center">
              <div className="col-md-12">
                <h1>{blog[0].title}</h1>
              </div>
            </div>
          </div>
        </div>
        </a>
      );
    }
    return (
      <div className="imagebg header-img" data-overlay="4">
        <div className="background-image-holder" style={{ backgroundImage: `url("${featureImage}")`, opacity: 1 }}>
          <img alt="background" src={featureImage} />
        </div>
        <div className="container pos-vertical-center">
          <div className="row text-center justify-content-center">
            <div className="col-md-12">
              <h1>{featureTitle}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isLoading, isLoadingFeature } = this.props;
    return (
      <div className="blog-page">
        <section className="header-blog-section">
          <div className="container">
            {isLoadingFeature ? (
              <div className="imagebg header-img loading-header" data-overlay="4">
                {HeaderLoading}
              </div>
            ) : (
              this.renderFeatureBlog()
            )}
          </div>
        </section>
        <section className="list-blog-section">
          <div className="container">
            <div className="row">{isLoading ? DefaultLoading : this.renderBlogItem()}</div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...selectAuthState(state),
    listBlog: selectListBlog(state),
    isLoading: selectIsLoading(state),
    blogFeature: selectListFeatureBlog(state),
    isLoadingFeature: selectIsLoadingFeature(state)
  };
};

export default connect(
  mapStateToProps,
  { fetchBlogAction, blogFeatureAction }
)(BlogScene);
