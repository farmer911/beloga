import React, { Component, Fragment } from 'react';
import Autosuggest from 'react-autosuggest';
import styles from '../tag-input/tag-input.module.scss';
import { Chip } from '../chip/chip';

const getSuggestionValue = (suggestion: any) => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion: any) => (
  <div className={`${styles['input-wrapper']} d-flex flex-row align-items-center`}>
    {/* <img className="no-margin-bottom" height={30} src={suggestion.image} /> */}
    <div className={styles['input']}>{suggestion.name}</div>
  </div>
);

const renderInputComponent = (inputProps: any) => (
  <Fragment>
    <input {...inputProps} />
  </Fragment>
);

export class CompanyAutoComplete extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
      suggestions: []
    };
  }

  getSuggestions = (value: any) => {
    const { suggestCompany } = this.props;
    let suggestValue = [];
    suggestValue = suggestCompany;
    if (!suggestValue) {
      return [];
    }
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? suggestValue
      : suggestValue.filter((data: any) => data.name.toLowerCase().slice(0, inputLength) === inputValue);
  };

  onChange = (event: any, { newValue }: any) => {
    const { type, suggestCompany } = this.props;
    this.props.setInputValue(type, '');
    this.props.setCompany(null);
    this.props.setCompanyLogo('');
    let data = undefined;
    if (suggestCompany) {
      data = suggestCompany.find((objectJson: any) => objectJson.name === newValue);
    }
    if (data) {
      this.props.setCompany(data.id);
      this.props.setCompanyLogo(data.image);
    }
    this.props.setInputValue(type, newValue);
    this.setState({
      inputValue: newValue
    });
  };

  onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      const { onChange, value, type, suggestCompany } = this.props;
      const v = e.target.value.trim();
      if (v === '') {
        return;
      }
      let newValue = undefined;
      newValue = suggestCompany.find((objectJson: any) => objectJson.name === v);
      if (newValue) {
        this.props.setCompany(newValue.id);
        this.props.setCompanyLogo(newValue.image);
        this.setState({
          value: newValue.id
          // inputValue: ''
        });
      }
      // onChange && onChange(newValue);
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

  onSuggestionSelected = () => {};

  onBlur = (event: any) => {};

  render() {
    const { value, placeHolder, isShowLogoSearch = true, type, companyName } = this.props;
    const { inputValue, suggestions } = this.state;
    // Autosuggest will pass through all these props to the input.

    const inputProps = {
      placeholder: placeHolder,
      value: companyName,
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
          focusInputOnSuggestionClick={true}
          renderSuggestion={renderSuggestion}
          renderInputComponent={renderInputComponent}
          inputProps={inputProps}
          theme={{width:"100%"}}
        />
      </React.Fragment>
    );
  }
}
