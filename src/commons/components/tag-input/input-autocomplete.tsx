import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import styles from './tag-input.module.scss';
import { Chip } from '../chip/chip';

const getSuggestionValue = (suggestion: any) => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion: any) => (
  <div className={`${styles['input-wrapper']} d-flex flex-row align-items-center`}>
    <img className="no-margin-bottom" height={30} src={suggestion.image_url} />
    <div className={styles['input']}>{suggestion.name}</div>
  </div>
);

const renderInputComponent = (inputProps: any) => (
  <div className={styles['input-container']}>
    <i className={`${styles['icon']} fas fa-search`} />
    <input {...inputProps} />
  </div>
);

export class InputAutoComplete extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
      suggestions: []
    };
  }

  componentWillUpdate(nextProps: any) {
    const { type, countryName, suggestCountry, cityInfo, stateInfo, city, state, country } = nextProps;
    if (type === 'city') {
      if (cityInfo && cityInfo.state) {
        this.props.setLocation('city', cityInfo.id);
        this.props.setLocation('state', cityInfo.state.id);
        this.props.setLocation('country', cityInfo.state.country);
        this.props.setInputValue('state', cityInfo.state.name);
        this.props.setInputValue('country', cityInfo.country.name);
        if (cityInfo.country && typeof nextProps.setCountryCode !== 'undefined') {
          nextProps.setCountryCode(cityInfo.country.code);
        }
      }
    }
    if (type === 'state') {
      if (stateInfo && stateInfo.country) {
        this.props.setLocation('state', stateInfo.id);
        this.props.setLocation('country', stateInfo.country.id);
        this.props.setInputValue('country', stateInfo.country.name);
      }
    }
    if (type === 'country' && suggestCountry.length) {
      const currentCountry = suggestCountry.find((objectJson: any) => objectJson.name === countryName);
      if (currentCountry && typeof nextProps.setCountryCode !== 'undefined') {
        nextProps.setCountryCode(currentCountry.code);
      }
    }
  }
  getSuggestions = (value: any) => {
    const { suggestCountry, suggestState, suggestCity, type } = this.props;
    if (type == 'country' || type == 'state' || type == 'city') {
      let suggestValue = [];
      if (type == 'country') {
        suggestValue = suggestCountry;
      } else if (type == 'state') {
        suggestValue = suggestState;
      } else if (type == 'city') {
        suggestValue = suggestCity;
      }
      if (!suggestValue) {
        return [];
      }
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      return inputLength === 0
        ? suggestValue
        : suggestValue.filter((data: any) => data.name.toLowerCase().slice(0, inputLength) === inputValue);
    }
  };

  onChange = (event: any, { newValue }: any) => {
    const { type, suggestCountry, suggestState, suggestCity } = this.props;
    if (type == 'city') {
      this.props.setLocation('city', null);
    } else if (type == 'state') {
      this.props.setLocation('city', null);
      this.props.setInputValue('city', '');
      this.props.setLocation('state', null);
    } else if (type == 'country') {
      this.props.setLocation('city', null);
      this.props.setInputValue('city', '');
      this.props.setLocation('state', null);
      this.props.setInputValue('state', '');
      this.props.setLocation('country', null);
      this.props.setInputValue('country', '');
    }

    let data = undefined;
    if (type == 'country') {
      data = suggestCountry.find((objectJson: any) => objectJson.name === newValue);
    } else if (type == 'city') {
      data = suggestCity.find((objectJson: any) => objectJson.name === newValue);
    } else if (type == 'state') {
      data = suggestState.find((objectJson: any) => objectJson.name === newValue);
    }
    if (data) {
      this.props.setLocation(this.props.type, data.id);
      if (type === 'country' && typeof this.props.setCountryCode !== 'undefined') {
        this.props.setCountryCode(data.code);
      }
    }
    this.props.setInputValue(type, newValue);
    this.setState({
      inputValue: newValue
    });
  };

  onKeyPress = (e: any) => {
    const {
      onChange,
      value,
      type,
      city,
      state,
      country,
      suggestCountry,
      suggestState,
      suggestCity,
      fetchCityAction,
      fetchCountryAction,
      fetchStateAction
    } = this.props;
    if (type == 'city') {
      // if (country && state) {
      //   fetchCityAction(country, state);
      // }
      this.props.setLocation('city', null);
    } else if (type == 'state') {
      // if (country) {
      //   fetchStateAction(country);
      // }

      this.props.setLocation('city', null);
      this.props.setInputValue('city', '');
      this.props.setLocation('state', null);
      //this.props.setInputValue('state', '');
    } else if (type == 'country') {
      //swapAllCountryAction(value);
      this.props.setLocation('city', null);
      this.props.setInputValue('city', '');
      this.props.setLocation('state', null);
      this.props.setInputValue('state', '');
      this.props.setLocation('country', null);
      //this.props.setInputValue('country', '');
    }

    if (e.key === 'Enter') {
      const v = e.target.value.trim();
      if (v === '') {
        return;
      }
      let newValue = undefined;
      if (type == 'country') {
        newValue = suggestCountry.find((objectJson: any) => objectJson.name === v);
      } else if (type == 'city') {
        newValue = suggestCity.find((objectJson: any) => objectJson.name === v);
      } else if (type == 'state') {
        newValue = suggestState.find((objectJson: any) => objectJson.name === v);
      }
      if (newValue) {
        this.props.setLocation(type, newValue.id);
        this.setState({
          value: newValue.id
          // inputValue: ''
        });
        if (type === 'country' && typeof this.props.setCountryCode !== 'undefined') {
          this.props.setCountryCode(newValue.code);
        }
      }
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }: any) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event: any, { suggestion }: any) => {
    const { type, suggestCountry, suggestState, suggestCity, swapCityDetailAction, swapStateDetailAction } = this.props;
    // if (type == 'city') {
    //   swapCityDetailAction(suggestion.id);
    //   this.props.setLocation('city', null);
    //   this.props.setLocation('state', null);
    //   this.props.setLocation('country', null);
    //   this.props.setInputValue('state', '');
    //   this.props.setInputValue('country', '');
    // } else if (type == 'state') {
    //   swapStateDetailAction(suggestion.id);
    //   this.props.setLocation('state', null);
    //   this.props.setLocation('country', null);
    //   this.props.setInputValue('country', '');
    // }
  };

  onBlur = (event: any) => {};

  render() {
    const { value, placeHolder, isShowLogoSearch = true, type, countryName, stateName, cityName } = this.props;
    const { inputValue, suggestions } = this.state;
    // Autosuggest will pass through all these props to the input.
    let valueLocation = inputValue;
    if (type == 'country') {
      valueLocation = countryName;
    } else if (type == 'city') {
      valueLocation = cityName;
    } else if (type == 'state') {
      valueLocation = stateName;
    }
    const inputProps = {
      placeholder: placeHolder,
      value: valueLocation,
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      onBlur: this.onBlur
    };

    // Finally, render it!
    return (
      <React.Fragment>
        <Autosuggest
          onSuggestionSelected={this.onSuggestionSelected}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          // focusInputOnSuggestionClick={true}
          renderSuggestion={renderSuggestion}
          renderInputComponent={isShowLogoSearch ? renderInputComponent : undefined}
          inputProps={inputProps}
          theme={{
            containerOpen: {
              position: 'absolute',
              zIndex: 1,
              backgroundColor: '#fff',
              width: 'calc(100% - 30px)'
            }
          }}
        />
      </React.Fragment>
    );
  }
}
