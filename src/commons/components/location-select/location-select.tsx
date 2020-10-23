import React, { Component } from 'react';
import { FormError } from '../form-error/form-error';

interface LocationSelectPropTypes {
  value?: {
    selectedCountryId?: number;
    selectedStateId?: number;
    selectedCityId?: number;
  };
  fetchStates?: any;
  fetchCities?: any;
  onChange?: any;
  countries?: any[];
  states?: any[];
  cities?: any[];
  error?: any;
}

export class LocationSelect extends Component<LocationSelectPropTypes> {
  onCountryChange = (e: any) => {
    const { fetchStates, onChange } = this.props;
    const countryId = Number(e.target.value);
    const newValue = {
      selectedCountryId: countryId,
      selectedStateId: -1,
      selectedCityId: -1
    };
    fetchStates && fetchStates(countryId);
    onChange && onChange(newValue);
  };

  onStateChange = (e: any) => {
    const { fetchCities, onChange, value } = this.props;
    const stateId = Number(e.target.value);
    const newValue = {
      ...value,
      selectedStateId: stateId,
      selectedCityId: -1
    };
    fetchCities && fetchCities(value ? value.selectedCountryId : -1, stateId);
    onChange && onChange(newValue);
  };

  onCityChange = (e: any) => {
    const { onChange, value } = this.props;
    const cityId = Number(e.target.value);
    const newValue = {
      ...value,
      selectedCityId: cityId
    };
    onChange && onChange(newValue);
  };

  renderCountryError = (error: string) => {
    return error && error[0] === 'Country is required' ? <FormError text={error[0]} /> : null;
  };

  renderStateError = (error: string) => {
    return error && error[0] === 'State is required' ? <FormError text={error[0]} /> : null;
  };

  renderCityError = (error: string) => {
    return error && error[0] === 'City is required' ? <FormError text={error[0]} /> : null;
  };

  render() {
    const { countries, states, cities, value, error } = this.props;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-4 col-sm-6">
            <label>Country*</label>
            <div className="input-select">
              <select onChange={this.onCountryChange} value={value ? value.selectedCountryId : -1}>
                <option value={-1}>Choose country</option>
                {countries &&
                  countries.map((country: any, index: number) => {
                    return (
                      <option key={index} value={country.id}>
                        {country.name}
                      </option>
                    );
                  })}
              </select>
              {this.renderCountryError(error)}
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <label>State*</label>
            <div className="input-select">
              <select onChange={this.onStateChange} value={value ? value.selectedStateId : -1}>
                <option value={-1}>Choose state</option>
                {states &&
                  states.map((state: any, index: number) => {
                    return (
                      <option key={index} value={state.id}>
                        {state.name}
                      </option>
                    );
                  })}
              </select>
              {this.renderStateError(error)}
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <label>City*</label>
            <div className="input-select">
              <select onChange={this.onCityChange} value={value ? value.selectedCityId : -1}>
                <option value={-1}>Choose city</option>
                {cities &&
                  cities.map((city: any, index: number) => {
                    return (
                      <option key={index} value={city.id}>
                        {city.name}
                      </option>
                    );
                  })}
              </select>
              {this.renderCityError(error)}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
