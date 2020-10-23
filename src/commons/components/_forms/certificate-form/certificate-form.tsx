import React, { Component } from 'react';
import styles from './certificate-form.module.scss';
import { FormError } from '../../form-error/form-error';
import { LoadingButton } from '../../_buttons';
import { MonthYearSelect } from '../../month-year-select/month-year-select';
import { ImagePreviewUpload } from '../../image-preview-upload/image-preview-upload';
import { enhanceLocationSelect } from '../../../../HOCs';
import { LocationAutoComplete } from '../../tag-input/location-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

interface CertificateFormPropTypes {
  form: any;
  onSubmit: any;
  isLoading: boolean;
  title: string;
  submitBtnTitle: string;
}

const EnhancedLocationSelect = enhanceLocationSelect();

class CertificateForm extends Component<CertificateFormPropTypes, {}> {
  image = {
    name: 'logoUploader',
    label: 'Logo'
  };

  state = {
    city: '',
    country: '',
    state: '',
    cityName: '',
    countryName: '',
    stateName: '',
    isShowValid: false,
    address:'',
    isEmptyAddress: false
  };

  setInitialState = () => {
    this.setState({
      city: '',
      country: '',
      state: '',
      cityName: '',
      countryName: '',
      stateName: '',
      isShowValid: false,
      address: '',
      isEmptyAddress: false
    });
  };

  address = {
    name: 'address',
    label: 'Address*',
    placeholder: 'Address',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Address is required',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  title = {
    name: 'title',
    label: 'Title*',
    placeholder: 'Title',
    options: {
      initialValue: '',
      rules: [{ required: true, message: 'Certificate name is required' }]
    }
  };

  timeline = {
    name: 'timeline',
    placeholder: 'Location',
    options: {
      initialValue: {
        fromMonth: 1,
        toMonth: 1,
        fromYear: 2018,
        toYear: 2018,
        currentlyWorkHere: false
      }
    }
  };

  description = {
    name: 'description',
    label: 'Description',
    placeholder: 'Description',
    options: {
      initialValue: '',
      rules: []
    }
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.form != this.props.form) {
      const { form } = this.props;
      if (form) {
        const country = form.getFieldValue('country');
        const city = form.getFieldValue('city');
        const state = form.getFieldValue('state');
        const country_name = form.getFieldValue('country_name');
        const city_name = form.getFieldValue('city_name');
        const state_name = form.getFieldValue('state_name');
        const address = form.getFieldValue('address');
        let _address = '' ;
        if(address){
          _address = address;
        }
        // if (!this.state.isShowValid) {
        //   this.setInputValue('country', country_name ? country_name : this.state.countryName);
        //   this.setInputValue('state', state_name ? state_name : this.state.stateName);
        //   this.setInputValue('city', city_name ? city_name : this.state.cityName);
        //   this.setLocation('country', country ? country : this.state.country);
        //   this.setLocation('state', state ? state : this.state.state);
        //   this.setLocation('city', city ? city : this.state.city);
        //   // this.setLocation('address', address ? address : '');
        //   this.setState({address: _address ? _address : ''});
        // }
        this.setState({
          countryName: country_name ? country_name : '',
          cityName: city_name ? city_name : '',
          stateName: state_name ? state_name : '',
          country: country ? country : '',
          state: state ? state : '',
          city: city ? city : '',
          address: _address ? _address: '',
        });
      }
    }
  }

  setInputValue = (type: string, inputValue: string) => {
    if (type == 'country') {
      this.setState({ countryName: inputValue });
    } else if (type == 'state') {
      this.setState({ stateName: inputValue });
    } else if (type == 'city') {
      this.setState({ cityName: inputValue });
    }
  };

  setLocation = (type: string, value: string) => {
    const { setFieldsValue } = this.props.form;
    if (type == 'country') {
      this.setState({ country: value });
    } else if (type == 'state') {
      this.setState({ state: value });
    } else if (type == 'city') {
      this.setState({ city: value });
    }
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, onSubmit, isLoading } = this.props;
    form.validateFields((error: any, value: any) => {
      if (!error) {
        value.country_name = this.state.countryName;
        value.state_name = this.state.stateName;
        value.city_name = this.state.cityName;
        value.address = this.state.address
        const { countryName, cityName, stateName, address } = this.state;
        if (!address || address == '') {
          this.setState({ isShowValid: true, isEmptyAddress: true });
          return;
        }
        this.setState({
          isShowValid: false,
          cityName: '',
          countryName: '',
          stateName: '',
          city: '',
          state: '',
          country: '',
          address:''
        });
        if (value[this.image.name]) {
          const { uploadFile } = value[this.image.name];
          !isLoading && onSubmit(value, uploadFile);
        } else {
          !isLoading && onSubmit(value);
        }
      }
    });
  };

  renderErrorSection = (name: string) => {
    const { getFieldError } = this.props.form;
    const errors = getFieldError(name);
    return errors
      ? errors.map((err: any, index: any) => {
          return <FormError key={index} text={err} />;
        })
      : null;
  };

  renderErrorAutoComplete = (type: string) => {
    const { stateName, cityName, countryName } = this.state;
    if (type == 'city' && (cityName == '' || !cityName)) {
      return <FormError key={type} text={'City is required'} />;
    } else if (type == 'country' && (countryName == '' || !countryName)) {
      return <FormError key={type} text={'Country is required'} />;
    } else if (type == 'state' && (stateName == '' || !stateName)) {
      return <FormError key={type} text={'State is required'} />;
    }
  };
  handleChangeAddress = (address:any) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ address });
    setFieldsValue({ address: address });
    if(!address || address == ''){
      this.setState({ isEmptyAddress: true });
    } else {
      this.setState({ isEmptyAddress: false });
    }
  };

  handleSelectAddress = (address:any) => {
    const { setFieldsValue } = this.props.form;
    let _sefl = this;
    _sefl.setState({address});
    setFieldsValue({
      address: address
      });
    geocodeByAddress(address)
      .then(function(results:any){
        let addressDetail = results[0].address_components;
        if(addressDetail){
          for(let i=0; i< addressDetail.length ; i++ ){
            if(addressDetail[i].types[0] == "locality"){
              _sefl.setState({ cityName: addressDetail[i].long_name });
              setFieldsValue({
              city_name: addressDetail[i].long_name
              });
            }
            if(addressDetail[i].types[0] == "administrative_area_level_1"){
              _sefl.setState({ stateName: addressDetail[i].long_name });
              setFieldsValue({
                state_name: addressDetail[i].long_name
              });
            }
            if(addressDetail[i].types[0] == "country"){
              _sefl.setState({ countryName: addressDetail[i].long_name });
              setFieldsValue({
                country_name: addressDetail[i].long_name
              });
            }
          }
        }
      })
      .catch((error:any) => console.error('Error', error));
  }


  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { isLoading, title, submitBtnTitle } = this.props;
    const { isShowValid, isEmptyAddress } = this.state;
    const renderInput = ({ getInputProps, getSuggestionItemProps, suggestions } : any) => (
      <div className="autocomplete-root">
        <input className="form-control" {...getInputProps()} placeholder="Ex: Philadelphia, Pennsylvania, United States" value={this.state.address}/>
        <div className={`autocomplete-dropdown-container ${suggestions.length>0 ? "has-location" : ""}`}>
          {suggestions.map((suggestion: any) => (
            // <!-- Add a style of "suggestion" to the suggested locations -->
            <div {...getSuggestionItemProps(suggestion)} className="suggestion">
              <span>{suggestion.description}</span>
            </div>
          ))}
        </div>
      </div>
    );

    // Limit the suggestions to show only cities in the US
    const searchOptions = {
      types: ['(cities)'],
      componentRestrictions: {country: ""}
     }
    return (
      <div className="row">
        <div className="col-md-12">
          <form className={styles['form']} onSubmit={this.handleSubmit}>
            <div style={{ margin: -10 }}>
              <h2 className="text-center com-form-title">{title}</h2>
              <div className="row">
                <div className="form-group col-12">
                  <ImagePreviewUpload {...getFieldProps(this.image.name)} />
                </div>
                {/* title */}
                <div className="form-group col-12 col-md-6 text-left">
                  <label>{this.title.label}</label>
                  <input
                    type="text"
                    placeholder={this.title.placeholder}
                    autoFocus
                    {...getFieldProps(this.title.name, this.title.options)}
                  />
                  <div>{this.renderErrorSection(this.title.name)}</div>
                </div>
                {/* location */}
                {/* <div className="col-12">
                  <EnhancedLocationSelect
                    error={getFieldError(this.places.name)}
                    {...getFieldProps(this.places.name, this.places.options)}
                  />
                </div> */}
                {/* <div className="col-12">
                  <span>{this.address.label}</span>
                  <input
                    type="text"
                    placeholder="Location"
                    {...getFieldProps(this.address.name, this.address.options)}
                  />
                  <div>{this.renderErrorSection(this.address.name)}</div>
                </div> */}
                <div className="form-group col-12 col-md-6">
                <span>Address*</span>
                <PlacesAutocomplete
                  value={this.state.address}
                  onChange={this.handleChangeAddress}
                  onSelect={this.handleSelectAddress}
              // Pass the search options prop
                  searchOptions={searchOptions}
                  debounce= {800}
                  >
                  {renderInput}
                </PlacesAutocomplete>
                  <div className="form-group-error">
                    {isEmptyAddress ? (
                      <div className="custom-form-error text-danger">{this.address.options.rules[0].message}</div>
                    ) : (
                      this.renderErrorSection(this.address.name)
                    )}
                  </div>
                </div>
                <div style={{display:'none'}}>
                <LocationAutoComplete
                  country={this.state.country}
                  state={this.state.state}
                  countryName={this.state.countryName}
                  stateName={this.state.stateName}
                  cityName={this.state.cityName}
                  setInputValue={this.setInputValue}
                  city={this.state.city}
                  setLocation={this.setLocation}
                  renderErrorSection={isShowValid ? this.renderErrorAutoComplete : () => {}}
                  {...getFieldProps('country')}
                  {...getFieldProps('state')}
                  {...getFieldProps('city')}
                  {...getFieldProps('address')}
                  getFieldProps={getFieldProps}
                />
                <input
                    type="text"
                    {...this.props.form.getFieldProps('address')}
                />
                </div>
                {/* month year from-to */}
                <div className="form-group col-12 col-md-12 text-left">
                  <MonthYearSelect {...getFieldProps(this.timeline.name, this.timeline.options)} />
                  <div>{this.renderErrorSection(this.timeline.name)}</div>
                </div>
                {/* description */}
                <div className="form-group col-12 col-md-12 text-left">
                  <label>{this.description.label}</label>
                  <textarea
                    rows={3}
                    placeholder={this.description.placeholder}
                    {...getFieldProps(this.description.name, this.description.options)}
                  />
                  <div>{this.renderErrorSection(this.description.name)}</div>
                </div>

                <div className={`col-md-12 d-flex justify-content-center ${styles['button-wrapper']}`}>
                  <LoadingButton isLoading={isLoading} type="submit" text="Save" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CertificateForm;
