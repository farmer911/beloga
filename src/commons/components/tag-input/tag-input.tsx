import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import styles from './tag-input.module.scss';
import { Chip } from '../chip/chip';

const getSuggestionValue = (suggestion: any) => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion: any) => (
  <div className={`${styles['input-wrapper']} d-flex flex-row align-items-center`}>
    <div className={styles['icon-interest']}>
      <img className="no-margin-bottom" height={30} src={suggestion.image_url} />
    </div>
    <div className={styles['input']}>{suggestion.name}</div>
  </div>
);

export class TagInput extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
      suggestions: []
    };
  }

  renderInputComponent = (inputProps: any) => (
    <div style={{ display: 'flex' }}>
      <div className={styles['input-container']}>
        <i className={`${styles['icon']} fas fa-search`} />
        <input {...inputProps} />
      </div>
      <button onClick={this.addInterest.bind(this, inputProps)} className="btn-modal-add-default no-margin-top" style={{height:33}}>
        + 
      </button>
    </div>
  );

  getSuggestions = (value: any) => {
    const { suggestData } = this.props;
    if (!suggestData) {
      return [];
    }
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : suggestData.filter((data: any) => data.name.toLowerCase().slice(0, inputLength) === inputValue);
  };

  onChange = (event: any, { newValue }: any) => {
    this.setState({
      inputValue: newValue
    });
  };
  addInterest = (e: any) => {
    const { onChange, value } = this.props;
    // console.log('value', value);
    const v = e.value.trim();
    const _value=[];
    if (v === '') {
      return;
    }
    if(value.length > 0){
      let i = value.length;
      for(let j=0; j<i; j++)
        { 
          if(value[j].name){
          _value.push(value[j].name);
          }
      }
    }
    //console.log(value, _value);
    if (_value.indexOf(v) > -1) {
      return;
    }
    if (value.indexOf(v) > -1) {
      return;
    }
    const _newValue=[];
    if(_value.length>0){ 
      for(let a=0; a<_value.length; a++){
        _newValue[a]=_value[a];
      }
    } else{ 
      for(let a=0; a<value.length; a++){
        _newValue[a]=value[a];
      }
    }
    const newValue = [..._newValue, v];
    // console.log('new', newValue)
    this.setState({
      value: newValue,
      inputValue: ''
    });
    onChange && onChange(newValue);
  };
  onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      const { onChange, value } = this.props;
      const v = e.target.value.trim();
      const _value=[];
    if (v === '') {
      return;
    }
    if(value.length > 0){
      let i = value.length;
      for(let j=0; j<i; j++)
        { 
          if(value[j].name){
          _value.push(value[j].name);
          }
      }
    }
    //console.log(value, _value);
    if (_value.indexOf(v) > -1) {
      return;
    }
    if (value.indexOf(v) > -1) {
      return;
    }
    const _newValue=[];
    if(_value.length>0){ 
      for(let a=0; a<_value.length; a++){
        _newValue[a]=_value[a];
      }
    } else{ 
      for(let a=0; a<value.length; a++){
        _newValue[a]=value[a];
      }
    }
    const newValue = [..._newValue, v];
    // console.log('new', newValue)
    this.setState({
      value: newValue,
      inputValue: ''
    });
    onChange && onChange(newValue);
    }
  };

  removeTag = (v: string) => {
    const { value, onChange } = this.props;
    const newValues = [...value];
    const _value=[];
    if(value.length > 0){
      let i = value.length;
      for(let j=0; j<i; j++)
        { 
          if(value[j].name){
          _value.push(value[j].name);
          }
      }
    }
    const _newValue=[];
    if(_value.length>0){ 
      for(let a=0; a<_value.length; a++){
        _newValue[a]=_value[a];
      }
    } else{ 
      for(let a=0; a<value.length; a++){
        _newValue[a]=value[a];
      }
    }
    // const newValues = [..._newValue];
    const index = newValues.indexOf(v);
    if (index > -1) {
      newValues.splice(index, 1);
      _newValue.splice(index, 1);
    }
    onChange(_newValue) && onChange(newValues);
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

  render() {
    const { value, placeHolder } = this.props;
    const { inputValue, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: placeHolder,
      value: inputValue,
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      addInterest: this.addInterest
    };

    // Finally, render it!
    return (
      <React.Fragment>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          renderInputComponent={this.renderInputComponent}
          inputProps={inputProps}
        />
        <div className={styles['chip-parent']}>
          {value &&
            value.map((v: any, index: number) => {
              if (typeof v === 'string') {
                return (
                  <div key={index} className={styles['chip-wrapper']}>
                    <Chip text={v} handleIconClick={() => this.removeTag(v)} />
                  </div>
                );
              }
              return (
                <div key={index} className={styles['chip-wrapper']}>
                  <Chip text={v.name} handleIconClick={() => this.removeTag(v)} />
                </div>
              );
            })}
        </div>
      </React.Fragment>
    );
  }
}
