import * as React from 'react';
import { connect } from 'react-redux';
import './search-suggest.modules.scss';
import SearchItem from '../search-item/search-item';
import { Dispatch } from 'redux';
import { setActiveIndexSearchSuggest } from '../../../ducks/search-profile.duck';

interface SearchSuggestProps {
  activeIndexSuggest: number;
  visible: boolean;
  history: any;
  minWidth: number;
  response: any;
  onShowAll: Function;
  setActiveIndexSearchSuggest: Function;
}

class SearchSuggest extends React.PureComponent<SearchSuggestProps> {

  showAll = () => {
    this.props.onShowAll();
  };

  render() {
    const { history, minWidth, visible, response, activeIndexSuggest, setActiveIndexSearchSuggest } = this.props;
    const newResponse = response.count > 0 ? response.results.slice(0, 5) : [];
    return (
      <span
        className="dropdown-el expanded"
        style={{
          minWidth: minWidth,
          display: visible ? undefined : 'none'
        }}
      >
        {newResponse.length > 0 &&
          newResponse.map((item: any, index: number) => {
            return (
              <SearchItem
                activeIndex={activeIndexSuggest}
                index={index}
                data={item}
                key={index}
                history={history}
                isSuggestItem={true}
                setActiveIndexSearchSuggest={setActiveIndexSearchSuggest}
              />
            );
          })}
        {newResponse.length > 0 && (
          <div
            onMouseMove={() => {
              if (newResponse.length !== activeIndexSuggest) {
                setActiveIndexSearchSuggest(newResponse.length);
              }
            }}
            className={
              newResponse.length === activeIndexSuggest
                ? 'search-item-container-suggest search-active'
                : 'search-item-container-suggest'
            }
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontStyle: 'italic',
              color: 'rgb(63, 198, 182)',
              padding: 12,
              fontSize: 15,
              borderBottom: 0
            }}
            onClick={this.showAll}
          >
            Show All
          </div>
        )}
      </span>
    );
  }
}
const mapStateToProps = (state: any) => ({
  activeIndexSuggest: state.SearchReducer.activeIndexSuggest
});
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setActiveIndexSearchSuggest: (param: number) => dispatch(setActiveIndexSearchSuggest(param))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchSuggest);
