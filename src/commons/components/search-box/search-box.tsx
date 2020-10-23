import React from 'react';
import styles from './search-box.module.scss';
import { SearchType } from '../../types/view-model';
import { render } from 'react-dom';

interface SearchBoxPropTypes {
  data?: SearchType[];
  actionSearch?: any;
}

interface ISearchBoxStateTypes {
  searchText: string;
}

interface SearchResultProptypes {
  data: SearchType[];
}

class SearchBox extends React.PureComponent<SearchBoxPropTypes, ISearchBoxStateTypes> {
  onChange = (e: { target: { name: string; value: string } }): void => {
    this.setState({
      searchText: e.target.value
    });
  };

  render() {
    const { data } = this.props;
    return (
      <div className={styles['search-box-wrapper']}>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className={`${styles['icon-align']} input-group-text`}>
              <i className={`${styles['search-icon']} stack-search`} />
            </span>
          </div>
          <input
            type="text"
            className={`${styles['search-input']} form-control`}
            placeholder="Search"
            onChange={this.onChange}
          />
          <div className="input-group-append">
            <span className={`${styles['icon-align']} input-group-text`}>
              <i className={`${styles['search-icon']} stack-down-open`} />
            </span>
          </div>
        </div>
        {/* <SearchResult data={data} /> */}
      </div>
    );
  }
}

export default SearchBox;

const SearchResult = (props: SearchResultProptypes) => {
  const { data } = props;
  return data.length ? (
    <div className={styles['search-result']}>
      {props.data.map((item: SearchType) => {
        return (
          <li key={item.id}>
            <a href="#">{item.title}</a>
          </li>
        );
      })}
    </div>
  ) : null;
};
