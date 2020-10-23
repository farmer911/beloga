import './search_item.modules.scss';
import * as React from 'react';
import { RoutePaths } from '../../constants';

interface SearchItemProps {
  index: number;
  activeIndex: number;
  data: any;
  history: any;
  isSuggestItem: boolean;
  setActiveIndexSearchSuggest: Function;
}

class SearchItem extends React.Component<SearchItemProps> {
  shouldComponentUpdate(nextProps: SearchItemProps) {
    if (nextProps.data !== this.props.data || nextProps.activeIndex !== this.props.activeIndex) {
      return true;
    }
    return false;
  }
  onPublicUser = () => {
    const { username } = this.props.data.user;
    this.props.history.push(RoutePaths.USER_PUBLIC.getPath(username));
  };

  renderSearchItemNormal = () => {
    const { user, image_url, job_title, location } = this.props.data;
    return (
      <div className="search-item-container row" onClick={this.onPublicUser}>
        <div className="col-sm-2" style={{ padding: 5 }}>
          <img className="search-item-avatar" src={image_url} alt="Avatar" />
        </div>
        <div className="col-sm-10">
          <div className="search-item-info">
            <span className="full_name">{user ? user.name : ''}</span>
            <span className="job_title">{job_title}</span>
            <span className="address">{location ? location : ''}</span>
          </div>
        </div>
      </div>
    );
  };

  renderSearchItemSuggest = () => {
    const { user, image_url, job_title, location } = this.props.data;
    const { index, activeIndex, setActiveIndexSearchSuggest } = this.props;
    return (
      <div
        onMouseMove={() => {
          if (index !== activeIndex) {
            setActiveIndexSearchSuggest(index);
          }
        }}
        className={
          index === activeIndex
            ? 'search-item-container-suggest search-active row'
            : 'search-item-container-suggest row'
        }
        onClick={this.onPublicUser}
      >
        <div className="col-sm-3" style={{ padding: 5, alignSelf: 'center' }}>
          <img className="search-item-avatar-suggest" src={image_url} alt="Avatar" />
        </div>
        <div className="col-sm-9">
          <div className="search-item-info-suggest">
            <span className="full_name">{user ? user.name : ''}</span>
            <span className="job_title">{job_title}</span>
            <span className="address">{location ? location : ''}</span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return this.props.isSuggestItem ? this.renderSearchItemSuggest() : this.renderSearchItemNormal();
  }
}

export default SearchItem;
