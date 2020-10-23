import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TagInput } from '../commons/components/tag-input/tag-input';
import { InputAutoComplete } from '../commons/components/tag-input/input-autocomplete';
import { fetchInterestAction, selectInterest } from '../ducks/interest.duck';
import {
  fetchCityAction,
  fetchCountryAction,
  fetchStateAction,
  selectCountries,
  selectStates,
  selectCities,
  locationResetInfoAction
} from '../ducks/location.duck';

const enhanceTagInput = () => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentWillMount() {
        const {
          fetchInterestAction,
          type = 'interest',
          fetchCityAction,
          fetchCountryAction,
          fetchStateAction,
          country,
          state
        } = this.props;
        if (type == 'interest') {
          fetchInterestAction();
        } else if (type == 'country') {
          fetchCountryAction();
        } else if (type == 'state' && country) {
          fetchStateAction(country);
        } else if (type == 'city' && country && state) {
          fetchCityAction(country, state);
        }
      }

      componentWillUpdate(nextProps: any) {
        const { type = 'interest', fetchStateAction, fetchCityAction, country, state } = this.props;
        if (nextProps.country != this.props.country) {
          if (type == 'state' && nextProps.country) {
            fetchStateAction(nextProps.country);
          } else if (type == 'city' && nextProps.country && nextProps.state) {
            fetchCityAction(nextProps.country, nextProps.state);
          }
        }
        if (nextProps.state != this.props.state) {
          if (type == 'city' && nextProps.country && nextProps.state) {
            fetchCityAction(nextProps.country, nextProps.state);
          }
        }
      }

      render() {
        const { suggestData, type = 'interest', suggestCountry, suggestState, suggestCity } = this.props;
        if (type == 'interest') {
          return <TagInput suggestData={suggestData} {...this.props} />;
        } else if (type == 'country') {
          return <InputAutoComplete suggestData={suggestCountry} {...this.props} />;
        } else if (type == 'state') {
          return <InputAutoComplete suggestData={suggestState} {...this.props} />;
        } else if (type == 'city') {
          return <InputAutoComplete suggestData={suggestCity} {...this.props} />;
        }
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      suggestData: selectInterest(state),

      // LOCATION
      suggestCountry: selectCountries(state),
      suggestState: selectStates(state),
      suggestCity: selectCities(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      {
        fetchInterestAction,
        fetchCountryAction,
        fetchStateAction,
        fetchCityAction,
        locationResetInfoAction
      }
    )(Wrapper())
  );
};

export default enhanceTagInput;
