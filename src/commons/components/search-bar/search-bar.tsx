import * as React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import './style.css';
import {
  storeSearchParams,
  SearchParams,
  requestSearchSuggest,
  resetSearchUserSuggest,
  // setSearchPageFirstLoadFlag,
  setActiveIndexSearchSuggest
} from '../../../ducks/search-profile.duck';
import { Dispatch } from 'redux';
import { RoutePaths } from '../../constants/route-paths';
import { getParamInUrl } from '../../../utils/utils';
import loadingWithConfig from '../../../HOCs/loadingWithConfig';
import { LoadingIcon } from '../loading-icon/loading-icon';
import sassVariable from '../../../styles/variables.module.scss';
import SearchSuggest from './search-suggest';

interface SearchBarStates {
  searchKey: string;
  visibleSuggest: boolean;
}

interface SearchBarProps {
  defaultWidth: string;
  params: any;
  history: any;
  isLoadingSearchSuggest: boolean;
  responseSuggest: any;
  // isFirstLoadPage: boolean;
  activeIndexSuggest: number;
  requestSearchSuggest: Function;
  storeSearchParams: Function;
  resetSearchUserSuggest: Function;
  // setSearchPageFirstLoadFlag: Function;
  setActiveIndexSearchSuggest: Function;
}
const DefaultLoading = loadingWithConfig(LoadingIcon, sassVariable.mainColor, 'search-suggest-icon-loading', 18);

class SearchBar extends React.PureComponent<SearchBarProps, SearchBarStates> {
  delayTimer: any;
  inputSearchWidth: any;
  constructor(props: SearchBarProps) {
    super(props);
    const params = getParamInUrl();
    if (params.key) {
      this.state = {
        searchKey: params.key,
        visibleSuggest: true
      };
    } else {
      this.state = {
        searchKey: '',
        visibleSuggest: true
      };
    }
  }

  componentDidMount() {
    $(document).click(() => {
      if (this.state.visibleSuggest) {
        this.setState({
          visibleSuggest: false
        });
      }
    });
    $('#custom-search-form').click(event => {
      try {
        if (!this.state.visibleSuggest) {
          this.setState({
            visibleSuggest: true
          });
        }
        const { activeIndexSuggest, responseSuggest } = this.props;
        const newResponse = responseSuggest.count > 0 ? responseSuggest.results.slice(0, 5) : [];
        if (activeIndexSuggest === newResponse.length) {
          this.searchAction();
        } else if (activeIndexSuggest === -1 && newResponse.length >= 0) {
          // NOT TO DO ANYTHING
        } else if (activeIndexSuggest >= 0 && activeIndexSuggest <= newResponse.length - 1) {
          const { username } = newResponse[activeIndexSuggest].user;
          this.props.history.push(RoutePaths.USER_PUBLIC.getPath(username));
        }
      } catch (error) {
        console.log('CLICK_SEARCH_ERROR:__ ', error);
      }
      event.stopPropagation();
    });
  }

  searchAction = () => {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }
    const params = getParamInUrl();
    this.props.resetSearchUserSuggest();
    if (this.state.searchKey === '') {
      return;
    }
    if (this.state.searchKey === params.key) {
      return;
    }
    this.props.storeSearchParams({
      key: this.state.searchKey,
      page: 1
    });
    // console.log(RoutePaths.USER_SEARCHING.getPath(this.state.searchKey, 1))
    this.props.history.push(RoutePaths.USER_SEARCHING.getPath(this.state.searchKey, 1));
  };

  onSearch = (e: any) => {
    e.preventDefault();
    this.searchAction();
  };

  onChange = (e: any) => {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }
    this.setState(
      {
        searchKey: e.target.value
      },
      () => {
        const { searchKey } = this.state;
        const {
          requestSearchSuggest,
          resetSearchUserSuggest
          // setSearchPageFirstLoadFlag,
          // isFirstLoadPage
        } = this.props;
        if (searchKey.length >= 3) {
          // if (isFirstLoadPage) {
          //   setSearchPageFirstLoadFlag(false);
          // }
          this.delayTimer = setTimeout(() => {
            requestSearchSuggest({ key: searchKey, page: 1 });
          }, 1234);
        } else if (searchKey.length === 0) {
          resetSearchUserSuggest();
        }
      }
    );
  };

  componentWillUnmount() {
    this.props.resetSearchUserSuggest();
  }

  onKeyDown = (e: any) => {
    const { activeIndexSuggest, setActiveIndexSearchSuggest, responseSuggest } = this.props;
    if (e.keyCode === 38) {
      if (activeIndexSuggest === -1) {
        return;
      }
      setActiveIndexSearchSuggest(activeIndexSuggest - 1);
    } else if (e.keyCode === 40) {
      const count = responseSuggest.count < 5 ? responseSuggest.count : 5;
      if (activeIndexSuggest === count) {
        return;
      }
      setActiveIndexSearchSuggest(activeIndexSuggest + 1);
    } else if (e.keyCode === 13) {
      if (activeIndexSuggest === -1 || activeIndexSuggest === responseSuggest.count) {
        this.searchAction();
      } else {
        const { username } = this.props.responseSuggest.results[activeIndexSuggest].user;
        this.props.history.push(RoutePaths.USER_PUBLIC.getPath(username));
      }
    }
  };

  render() {
    const { isLoadingSearchSuggest, history, defaultWidth, responseSuggest } = this.props;
    const { visibleSuggest } = this.state;
    return (
      <form
        onSubmit={this.onSearch}
        id="custom-search-form"
        className="form-search form-horizontal pull-right"
        onKeyDown={this.onKeyDown}
      >
        <div
          ref={(ref: any) => {
            this.inputSearchWidth = $(ref).width();
          }}
          className="input-append span12"
          style={{ width: defaultWidth, position: 'relative' }}
        >
          <img
            src="/images/icons/search_icon.svg"
            style={{ position: 'absolute', top: 10, left: 12, marginRight: 10 }}
            onClick={this.onSearch}
            width={18}
            height={18}
            alt="Search Icon"
          />
          <input
            name="searchKey"
            value={this.state.searchKey}
            type="text"
            className="search-query mac-style"
            placeholder="Search user by name..."
            title="Search user by name, location, job ..."
            onChange={this.onChange}
            autoComplete="off"
            style={{ padding: '0px 35px' }}
            onMouseMove={() => {
              const { setActiveIndexSearchSuggest, activeIndexSuggest } = this.props;
              if (activeIndexSuggest !== -1) {
                setActiveIndexSearchSuggest(-1);
              }
            }}
          />
          {isLoadingSearchSuggest && DefaultLoading}
          <SearchSuggest
            history={history}
            minWidth={this.inputSearchWidth}
            visible={visibleSuggest}
            response={responseSuggest}
            onShowAll={this.searchAction}
          />
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state: any) => ({
  params: state.SearchReducer.params,
  isLoadingSearchSuggest: state.SearchReducer.isLoadingSearchSuggest,
  responseSuggest: state.SearchReducer.responseSuggest,
  // isFirstLoadPage: state.SearchReducer.isFirstLoadPage,
  activeIndexSuggest: state.SearchReducer.activeIndexSuggest
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    resetSearchUserSuggest: () => dispatch(resetSearchUserSuggest()),
    requestSearchSuggest: (params: SearchParams) => dispatch(requestSearchSuggest(params)),
    storeSearchParams: (params: any) => dispatch(storeSearchParams(params)),
    // setSearchPageFirstLoadFlag: (param: boolean) => dispatch(setSearchPageFirstLoadFlag(param)),
    setActiveIndexSearchSuggest: (param: number) => dispatch(setActiveIndexSearchSuggest(param))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
