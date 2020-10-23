import './search_result.modules.scss';
require('../../styles/stack-theme/css/pagination.less');
require('../../styles/stack-theme/css/pager.less');
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchItem from '../../commons/components/search-item/search-item';
import { Dispatch } from 'redux';
import {
  SearchParams,
  requestSearch,
  storeSearchParams,
  resetResponseData,
  resetSearchUserSuggest,
  // setSearchPageFirstLoadFlag,
  setActiveIndexSearchSuggest
} from '../../ducks/search-profile.duck';
import Pagination from 'react-js-pagination';
import { apiConfig } from '../../commons/constants/pagination';
import { RoutePaths } from '../../commons/constants';
import sassVariable from '../../styles/variables.module.scss';
import { loadingWithConfig } from '../../HOCs';
import { LoadingIcon } from '../../commons/components';
import { getParamInUrl } from '../../utils/utils';
interface SearchResultScreenProps {
  history: any;
  isLoadingSearch: boolean;
  response: any;
  error: any;
  params: any;
  // isFirstLoadPage: boolean;
  requestSearch: Function;
  storeSearchParams: Function;
  resetResponseData: Function;
  resetSearchUserSuggest: Function;
  // setSearchPageFirstLoadFlag: Function;
  setActiveIndexSearchSuggest: Function;
}

interface SearchResultScreenStates {
  activePage: number;
  key: string;
}
const DefaultLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'component-loading-wrapper', 30);
class SearchResultScreen extends Component<SearchResultScreenProps, SearchResultScreenStates> {
  constructor(props: SearchResultScreenProps) {
    super(props);

    const data = getParamInUrl();
    const isValidParam = data.key !== '' && parseInt(data.page, 10) > 0;
    if (isValidParam) {
      this.state = {
        activePage: parseInt(data.page, 10),
        key: data.key
      };
      props.storeSearchParams({
        key: data.key,
        page: data.page
      });
      props.requestSearch({ key: data.key, page: data.page });
    } else {
      // Dispatch empty data.
      this.state = {
        activePage: 0,
        key: ''
      };
      props.storeSearchParams({
        key: '',
        page: 0
      });
      props.resetResponseData();
    }
  }

  componentWillMount() {
    // this.props.setSearchPageFirstLoadFlag(true);
    this.props.setActiveIndexSearchSuggest(-1);
  }
  componentWillUnmount() {
    // this.props.setSearchPageFirstLoadFlag(false);
    this.props.setActiveIndexSearchSuggest(-1);
  }

  shouldComponentUpdate(nextProps: SearchResultScreenProps) {
    if (this.props.isLoadingSearch !== nextProps.isLoadingSearch) {
      return true;
    }
    if (nextProps.params !== this.props.params) {
      this.setState({
        activePage: nextProps.params.page,
        key: nextProps.params.key
      });
      nextProps.requestSearch({ key: nextProps.params.key, page: nextProps.params.page });
    }
    return false;
  }

  componentWillReceiveProps(nextProps: SearchResultScreenProps) {
    if (this.props.params != nextProps.params) {
      this.setState({
        activePage: nextProps.params.page,
        key: nextProps.params.key
      });
    }
  }

  handlePageChange = (pageNumber: number) => {
    if (this.state.activePage === pageNumber) {
      return;
    }
    // if (this.props.isFirstLoadPage) {
    //   this.props.setSearchPageFirstLoadFlag(false);
    // }
    this.setState(
      {
        activePage: pageNumber
      },
      () => {
        const { activePage } = this.state;
        const { key } = this.props.params;
        this.props.storeSearchParams({
          key: key,
          page: activePage
        });
        this.props.history.push(RoutePaths.USER_SEARCHING.getPath(this.props.params.key, activePage));
      }
    );
  };

  renderNotFound = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12" style={{ paddingTop: 20, textAlign: 'center' }}>
            <span className="search-title-result">No results found</span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isLoadingSearch, response, history } = this.props;
    // console.log(this.props  )

    if (isLoadingSearch) {
      return DefaultLoading;
    }

    if (response && response.count === 0) {
      return this.renderNotFound();
    }

    if (response && response.count > 0) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-12" style={{ paddingTop: 20, textAlign: 'center' }}>
              <span className="search-title-result">{`Showing ${response.count} results`}</span>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-sm-12">
              <div className="search-list-container">
                {response.count > 0 &&
                  response.results.map((item: any, index: number) => {
                    return (
                      <SearchItem
                        activeIndex={-1}
                        index={index}
                        data={item}
                        key={index}
                        history={history}
                        isSuggestItem={false}
                        setActiveIndexSearchSuggest={() => {}}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
          <hr />
          <div className="col-sm-12">
            {this.state.activePage > 0 && response.count > 0 && (
              <Pagination
                activePage={parseInt(getParamInUrl().page, 10)}
                itemsCountPerPage={apiConfig.limit}
                totalItemsCount={response.count}
                pageRangeDisplayed={apiConfig.pageRangeDisplay}
                onChange={this.handlePageChange}
              />
            )}
            <br />
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state: any) => ({
  isLoadingSearch: state.SearchReducer.isLoadingSearch,
  response: state.SearchReducer.response,
  error: state.SearchReducer.error,
  params: state.SearchReducer.params,
  // isFirstLoadPage: state.SearchReducer.isFirstLoadPage
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    requestSearch: (params: SearchParams) => dispatch(requestSearch(params)),
    storeSearchParams: (params: any) => dispatch(storeSearchParams(params)),
    resetResponseData: () => dispatch(resetResponseData()),
    resetSearchUserSuggest: () => dispatch(resetSearchUserSuggest()),
    // setSearchPageFirstLoadFlag: (param: boolean) => dispatch(setSearchPageFirstLoadFlag(param)),
    setActiveIndexSearchSuggest: (param: number) => dispatch(setActiveIndexSearchSuggest(param))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultScreen);
