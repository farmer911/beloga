import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputSearchProfile } from '../commons/components/tag-input/input-searchprofile';
import { selectListUser, selectLoadingSearch } from '../ducks/search-profile.duck';

const enhanceSearchTagInput = () => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentWillMount() {}

      componentWillUpdate(nextProps: any) {}

      render() {
        const { suggestData, type = 'user', suggestUser, isLoading } = this.props;
        return <InputSearchProfile suggestData={suggestUser} {...this.props} isLoading={isLoading} />;
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      // LOCATION
      suggestUser: selectListUser(state),
      isLoading: selectLoadingSearch(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      {}
    )(Wrapper())
  );
};

export default enhanceSearchTagInput;
