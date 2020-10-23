import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import styles from './tag-input.module.scss';
import { Chip } from '../chip/chip';
import { selectListUser } from '../../../ducks/search-profile.duck';
import { LoadingIcon } from '../loading-icon/loading-icon';
const getSuggestionValue = (suggestion: any) => suggestion.user.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion: any) => {
  if (Object.keys(suggestion).length === 0 && suggestion.constructor === Object)
    return (
      <div className={`${styles['input-wrapper-search']} d-flex flex-row align-items-center`}>
        <div className={styles['input']}>Not found</div>
      </div>
    );
  else {
    return (
      <div className={`${styles['input-wrapper-search']} d-flex flex-row align-items-center`}>
        <img className="no-margin-bottom-img" height={30} src={suggestion.image_url} />
        <div className={styles['input']}>{suggestion.user.name}</div>
      </div>
    )
  }
}

const renderInputComponent = (inputProps: any) => (
  <div className={styles['input-container-search']}>
    <input
      {...inputProps}
      style={{
        border: 'none',
        outline: 'none',
        background: 'white',
        padding: '0px !important'
      }}
    />
  </div>
);

export class InputSearchProfile extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
      suggestions: []
    };
  }

  onChange = (event: any, { newValue }: any) => {
    this.setState({
      inputValue: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }: any) => {
    // const { searchUserAction } = this.props;
    // searchUserAction(value);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event: any, { suggestion }: any) => {
    location.href = `/public/${suggestion.user.username}`;
  };

  render() {
    const { placeHolder, isShowLogoSearch = true, type, userName, suggestUser, isLoading } = this.props;
    const { inputValue } = this.state;
    // Autosuggest will pass through all these props to the input.
    let valueLocation = inputValue;
    if (type === 'user') {
      valueLocation = userName;
    }
    const inputProps = {
      placeholder: placeHolder,
      value: valueLocation,
      onChange: this.onChange,
    };

    return (
      <React.Fragment>
        <Autosuggest
          onSuggestionSelected={this.onSuggestionSelected}
          suggestions={suggestUser}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          focusInputOnSuggestionClick={true}
          renderSuggestion={renderSuggestion}
          renderInputComponent={isShowLogoSearch ? renderInputComponent : undefined}
          inputProps={inputProps}
        />
        {isLoading && <LoadingIcon color="#ECE7E6" />}
      </React.Fragment>
    );
  }
}
