import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { LocationSelect } from '../commons/components';
import {
  fetchCountryAction,
  fetchCityAction,
  fetchStateAction,
  selectCountries,
  selectStates,
  selectCities
} from '../ducks/location.duck';

const enhanceLocationSelect = () => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentWillMount() {
        const { fetchCountryAction } = this.props;
        fetchCountryAction();
      }

      render() {
        const { countries, cities, states, fetchStateAction, fetchCityAction } = this.props;
        return (
          <LocationSelect
            fetchStates={fetchStateAction}
            fetchCities={fetchCityAction}
            countries={countries}
            states={states}
            cities={cities}
            {...this.props}
          />
        );
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      countries: selectCountries(state),
      states: selectStates(state),
      cities: selectCities(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      { fetchCountryAction, fetchCityAction, fetchStateAction }
    )(Wrapper())
  );
};

export default enhanceLocationSelect;
