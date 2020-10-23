import React, { Component } from 'react';
import { RegexConst, RoutePaths } from '../../../../commons/constants';
import styles from './personal-form.module.scss';
import { LoadingButton } from '../../_buttons';
import { FormError } from '../../form-error/form-error';
import { EmploymentStatusEnum, SeekingStatusEnum } from '../../../../commons/types';
import { Modal } from '../../modal/modal';
import { createForm } from 'rc-form';
import { EmailForm } from '../../_forms/email-form/email-form';
import { enhanceLocationSelect, enhanceTagInput } from '../../../../HOCs';
import { updateUserMapper } from '../../../../utils/mapper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { userInfo } from 'os';
import { LocationAutoComplete } from '../../tag-input/location-autocomplete';
import { parsePhoneNumberFromString, AsYouType, getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

interface PersonalFormPropsType {
  userInfo: any;
  form: any;
  actionSubmit: any;
  actionSubmitEmail: any;
  isLoading: boolean;
  errorFromServer: string;
  actionCheckEmail: any;
  checkValidUsernameAction: any;
}

const EnhanceEmailForm = createForm()(EmailForm);

class PersonalForm extends Component<PersonalFormPropsType> {
  state = {
    isOpenEmailModal: false,
    date_of_birth: '',
    inValidAge: false,
    isEmptyDate: false,
    city: '',
    country: '',
    state: '',
    cityName: '',
    countryName: '',
    stateName: '',
    countryCode: undefined,
    phone: { value: '', maxLength: 20, isValid: false, error: '' },
    isShowValid: false,
    address: '',
    isEmptyAddress: false,
    job_title: '',
    isEmptyJobtitle: false,
    isEmptyPhone: false
  };
  country = {
    label: 'Country',
    name: 'country_name',
    options: [
      {
        initialValue: []
      }
    ]
  };
  stateLocation = {
    label: 'State',
    name: 'state_name',
    options: [
      {
        initialValue: []
      }
    ]
  };
  city = {
    label: 'City',
    name: 'city_name',
    options: [
      {
        initialValue: []
      }
    ]
  };

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
    if (type == 'country') {
      this.setState({ country: value });
    } else if (type == 'state') {
      this.setState({ state: value });
    } else if (type == 'city') {
      this.setState({ city: value });
    }
  };

  handleOnSubmit = (e: any) => {
    e.preventDefault();
    const { form, actionSubmit } = this.props;
    const urlCondition = RegexConst.LINK_REGREX;
    form.validateFields((error: any, value: any) => {
      if (value.portfolio == '') {
        value.portfolio = '';
      }
      if (!value.portfolio.match(urlCondition) && value.portfolio !== '') {
        value.portfolio = 'https://' + value.portfolio;
      }
      if (!error) {
        const { country, state, city, address } = this.state;
        value.country = country;
        value.state = state;
        value.city = city;
        value.address = address;
        const mappedData = updateUserMapper.formToApi(value);
        const bod = this.state.date_of_birth;
        // lib getMonth - 1;
        if (bod && bod != '') {
          //const currentMonth = bod.getMonth() + 1;
          //const dateOfBirth = bod.getFullYear() + '/' + currentMonth + '/' + bod.getDate();
          mappedData.date_of_birth = moment(bod).format('YYYY/MM/DD');
        } else {
          mappedData.date_of_birth = null;
        }
        const { countryName, cityName, stateName, date_of_birth, phone } = this.state;
        if (
          // countryName == '' ||
          // cityName == '' ||
          // stateName == '' ||
          // !countryName ||
          // !cityName ||
          // !stateName ||
          !date_of_birth ||
          date_of_birth == ''
        ) {
          this.setState({ isShowValid: true });
          if (!date_of_birth || date_of_birth == '') {
            this.setState({ isEmptyDate: true });
          }
          return;
        }
        if (!address || address == '') {
          this.setState({ isShowValid: true, isEmptyAddress: true });
          return;
        }
        if (!phone.value || phone.value == '') {
          this.setState({ isShowValid: true, isEmptyPhone: true });
          return;
        }
        this.setState({ isShowValid: false });
        // console.log('map', mappedData);
        actionSubmit(mappedData);
      }
    });
  };

  formRefEmail: any;

  toggleEmailModal = () => {
    const { userInfo } = this.props;
    this.formRefEmail.props.form.setFieldsValue({ ...userInfo });
    this.setState({
      isOpenEmailModal: !this.state.isOpenEmailModal
    });
  };

  handleEmailSubmit = (data: any) => {
    const { actionSubmitEmail, userInfo } = this.props;
    if (data.email !== userInfo.email) {
      actionSubmitEmail(data);
    }
    this.toggleEmailModal();
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

  firstname = {
    label: 'First name*',
    type: 'text',
    name: 'first_name',
    placeholder: 'First name',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'First name is required.',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  lastname = {
    label: 'Last name*',
    type: 'text',
    name: 'last_name',
    placeholder: 'Last name',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Last name is required.',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  username = {
    name: 'username',
    type: 'text',
    label: 'Username*',
    placeholder: 'username',
    options: {
      initialValue: '',
      rules: [
        { required: true, message: 'Username name is required' },
        {
          transform: (value: string) => value.trim(),
          validator: (rule: any, value: any, callback: any) => {
            const { checkValidUsernameAction, userInfo } = this.props;
            const conditionUsername = /^[A-Za-z0-9@.+\-_]+$/g;

            if (value === '' || value === userInfo.username) {
              callback();
              return;
            }
            if (value.match(conditionUsername)) {
              checkValidUsernameAction(value, callback);
              return;
            }
            callback('Username input contains no characters specified!');
          }
        }
      ]
    }
  };

  email = {
    label: 'Email Address',
    type: 'text',
    name: 'email',
    placeholder: 'Email',
    options: {
      initialValue: ''
    }
  };

  password = {
    label: 'Password*',
    type: 'password',
    name: 'password1',
    placeholder: 'Password',
    options: {
      initialValue: '',
      rules: [
        {
          min: 8,
          message: 'Password must be at least 8 characters'
        },
        { required: true, message: 'Password is required.' },
        {
          validator: (rule: any, value: any, callback: any) => {
            const { validateFields, isFieldTouched } = this.props.form;
            if (isFieldTouched(this.passwordConfirm.name)) {
              validateFields([this.passwordConfirm.name], {
                force: true
              });
            }
            const conditionOneLetter = RegexConst.SAME_CHARACTER_REGEX;
            const conditionMissSpecial = RegexConst.MISS_CHARACTER_SPECIAL;
            const conditionPassword = RegexConst.ONLY_NUMERIC_REGEX;
            if (!value.match(conditionPassword)) {
              if (value.match(conditionOneLetter)) {
                callback('Password is too common.');
              }
              else if (!value.match(conditionMissSpecial)) {
                callback('Password must contain a special character.')
              }
              callback();
              return;
            }
            callback("Password input can't be entirely numeric!");
          }
        }
      ]
    }
  };

  passwordConfirm = {
    label: 'Confirm Password*',
    type: 'password',
    name: 'password2',
    placeholder: 'Confirm Password',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Password confirmation is required.'
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            const { getFieldValue } = this.props.form;
            const inputPassword = getFieldValue(this.password.name);
            if (value !== inputPassword) {
              callback('Confirm password does not match!');
              return;
            }
            callback();
          }
        }
      ]
    }
  };

  address = {
    name: 'address',
    label: 'Current Location*',
    placeholder: 'Current Location',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Current Location is required',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };

  date_of_birth = {
    name: 'date_of_birth',
    label: 'Date of birth*',
    placeholder: 'Date of birth',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Date of birth is required.',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };
  phone = {
    name: 'phone',
    label: 'Phone*',
    placeholder: 'Phone Number',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Phone is required'
        }
      ]
    }
  };

  employmentStatus = {
    name: 'employment_status',
    label: 'Employment Status*',
    placeholder: 'Employment Status',
    options: {
      initialValue: 'Full Time',
      rules: [
        {
          type: 'enum',
          enum: [...Object.keys(EmploymentStatusEnum).map((key: any) => key)]
        },
        { required: true }
      ]
    }
  };

  seekingStatus = {
    name: 'seeking_status',
    label: 'Seeking Status*',
    placeholder: 'Seeking Status',
    options: {
      initialValue: SeekingStatusEnum.Active,
      rules: [
        {
          type: 'enum',
          enum: [...Object.keys(SeekingStatusEnum).map((key: any) => SeekingStatusEnum[key])]
        },
        { required: true }
      ]
    }
  };

  job_title = {
    name: 'job_title',
    label: 'Job Title or Posittion*',
    placeholder: 'Job Title or Posittion',
    options: {
      initialValue: '',
      rules: [
        {
          required: true,
          message: 'Job Title or Posittion is required',
          transform: (value: string) => value.trim()
        }
      ]
    }
  };
  portfolio = {
    name: 'portfolio',
    label: 'Website / Portfolio',
    placeholder: 'your-portfolio.com',
    options: {
      initialValue: '',
      rules: [
        {
          transform: (value: string) => value.trim(),
          validator: (rule: any, value: any, callback: any) => {
            const urlCondition = RegexConst.LINK_REGREX;
            if (value === '') {
              callback();
              return;
            }
            if (!value.match(urlCondition)) {
              value = 'http://' + value;
              if (!value.match(urlCondition)) {
                callback('URL is not valid.');
              }
            }
            callback();
            return;
          }
        }
      ]
    }
  };

  handleSelect = (date: Date) => { };
  handleChange = (date: Date) => {
    if (!date) {
      return this.setState({
        date_of_birth: null,
        isEmptyDate: true
      });
    }
    const yearNow = new Date().getFullYear();
    const yearChange = date.getFullYear();
    const ageInfo = yearNow - yearChange;
    if (ageInfo < 13 || ageInfo > 99) {
      this.setState({
        inValidAge: true,
        date_of_birth: null,
        isEmptyDate: true
      });
    } else {
      this.setState({
        inValidAge: false,
        date_of_birth: date,
        isEmptyDate: false
      });
    }
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.userInfo && prevProps.userInfo !== this.props.userInfo) {
      const { userInfo } = this.props;
      if (userInfo && !userInfo.date_of_birth) {
        this.setState({
          date_of_birth: null,
          isEmptyDate: true
        });
      } else if (userInfo && userInfo.date_of_birth) {
        this.setState({
          date_of_birth: new Date(userInfo.date_of_birth),
          isEmptyDate: false
        });
      }
      if (userInfo && !userInfo.address) {
        this.setState({
          address: null,
          isEmptyAddress: true
        });
      } else if (userInfo && userInfo.address) {
        this.setState({
          address: userInfo.address,
          isEmptyAddress: false
        });
      }
      //const job_title = this.props.form.getFieldProps('job_title');
      if (userInfo && !userInfo.job_title) {
        this.setState({
          job_title: null,
          isEmptyJobtitle: true
        });
      } else if (userInfo && userInfo.job_title) {
        this.setState({
          job_title: userInfo.job_title,
          isEmptyJobtitle: false
        });
      }
    }

    if (!this.state.countryCode) {
      this.setState({ countryCode: 'US' });
    }
  }

  componentWillUpdate(nextProps: any) {
    if (nextProps.userInfo && nextProps.userInfo !== this.props.userInfo) {
      const {
        userInfo: { country_name, state_name, city_name, state, city, country, date_of_birth, phone, address }
      } = nextProps;
      this.setInputValue('country', country_name);
      this.setInputValue('state', state_name);
      this.setInputValue('city', city_name);
      this.setLocation('country', country);
      this.setLocation('state', state);
      this.setLocation('city', city);
      if (address) {
        this.setLocation('address', address);
        let _address = address;
        this.setState({ address: _address });
      } else {
        let _address = `${city_name}, ${state_name}, ${country_name}`;
        // console.log('adddd', address);
        this.setState({ address: _address });
      }

      //const date_of_birth = this.props.form.getFieldProps('date_of_birth');
      if (!date_of_birth && this.state.isShowValid) {
        this.setState({
          date_of_birth: '',
          isEmptyDate: true
        });
      } else if (date_of_birth && date_of_birth != '') {
        this.setState({
          date_of_birth: new Date(date_of_birth),
          isEmptyDate: false
        });
      } else {
        this.setState({
          date_of_birth: '',
          isEmptyDate: false
        });
      }
      if (phone && this.state.phone.value === '') {
        this.setState({ phone: { value: phone } });
      }
    }
  }

  setCountryCode = (code: string) => {
    const { setFieldsValue } = this.props.form;
    if (!this.state.phone) {
      if (code !== '' && code !== this.state.countryCode) {
        this.setState({ countryCode: code, phone: { value: '' }, isEmptyPhone: true });
        setFieldsValue({
          phone: ''
        });
      }
    }
  };

  getCountryCodeOrDefault(code?: string) {
    return (code ? code : 'US') as CountryCode;
  }

  maskPhoneInput = (e: any) => {
    const { setFieldsValue } = this.props.form;
    const { countryCode } = this.state;
    let callingCode = '+1';
    try {
      const countryCallingCode = getCountryCallingCode(this.getCountryCodeOrDefault(countryCode));
      callingCode = '+' + countryCallingCode.toString();
    } catch (err) { }
    if (e.target.value !== '') {
      let inputValue = e.target.value;
      inputValue = inputValue.replace(/\s+/g, '');
      const maxLength = inputValue.length;
      if (this.state.phone.isValid && maxLength > this.state.phone.maxLength) {
        e.target.value = this.state.phone.value;
        let inputValue = e.target.value;
        inputValue = inputValue.replace(/\s+/g, '');
        const maxLength = inputValue.length;
        this.setState({ phone: { value: e.target.value, isValid: true, maxLength: maxLength, error: '' } });

        setFieldsValue({ phone: e.target.value });
      } else {
        const phoneNumber = parsePhoneNumberFromString(e.target.value, countryCode);
        if (phoneNumber && phoneNumber.number.length > 0) {
          e.target.value = phoneNumber.formatInternational();
          this.setState({ phone: { value: e.target.value } });
          setFieldsValue({ phone: e.target.value });
        }

        if (phoneNumber && phoneNumber.isValid()) {
          this.setState({ phone: { value: e.target.value, isValid: true, maxLength: maxLength, error: '' } });
        } else {
          this.setState({ phone: { value: e.target.value, isValid: false, error: 'Phone number is not valid' } });
        }
      }
    }
    if (e.target.value === '' || e.target.value === callingCode || e.target.value.length <= callingCode.length) {
      e.target.value = callingCode;
      this.setState({ phone: { value: e.target.value, isValid: false, error: 'Phone number is not valid' } });
      setFieldsValue({ phone: e.target.value });
    }
  };

  checkPhone = (event: any) => {
    const { setFieldsValue } = this.props.form;
    const { countryCode } = this.state;
    let callingCode = '+1';
    try {
      const countryCallingCode = getCountryCallingCode(this.getCountryCodeOrDefault(countryCode));
      callingCode = '+' + countryCallingCode.toString();
    } catch (err) { }
    if (this.state.phone.value === callingCode) {
      this.setState({ phone: { value: '' }, isEmptyPhone: true });
      setFieldsValue({ phone: '' });
    } else {
      this.setState({ isEmptyPhone: false });
    }
  };
  focusPhone = () => {
    const { setFieldsValue } = this.props.form;
    const { countryCode } = this.state;
    let callingCode = '+1';
    try {
      const countryCallingCode = getCountryCallingCode(this.getCountryCodeOrDefault(countryCode));
      callingCode = '+' + countryCallingCode.toString();
    } catch (err) { }
    if (this.state.phone.value === '') {
      setFieldsValue({ phone: callingCode });
      return this.setState({
        phone: { value: callingCode }
      });
    }
  };
  autoMoveCaretAtEnd = (e: any) => {
    let temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }
  handleChangeAddress = (address: any) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ address });
    setFieldsValue({ address: address });
    if (!address || address == '') {
      this.setState({ isEmptyAddress: true });
    } else {
      this.setState({ isEmptyAddress: false });
    }
  };

  handleSelectAddress = (address: any) => {
    const { setFieldsValue } = this.props.form;
    let _sefl = this;
    this.setState({ address });
    geocodeByAddress(address)
      .then(function (results: any) {
        let addressDetail = results[0].address_components;
        if (addressDetail) {
          for (let i = 0; i < addressDetail.length; i++) {
            if (addressDetail[i].types[0] == "locality") {
              _sefl.setState({ cityName: addressDetail[i].long_name });
              setFieldsValue({
                city_name: addressDetail[i].long_name
              });
            }
            if (addressDetail[i].types[0] == "administrative_area_level_1") {
              _sefl.setState({ stateName: addressDetail[i].long_name });
              setFieldsValue({
                state_name: addressDetail[i].long_name
              });
            }
            if (addressDetail[i].types[0] == "country") {
              _sefl.setState({ countryName: addressDetail[i].long_name });
              setFieldsValue({
                country_name: addressDetail[i].long_name
              });
            }
          }
        }
      })
      .catch((error: any) => console.error('Error', error));
  }

  render() {
    const {
      userInfo,
      form: { getFieldProps },
      isLoading,
      actionCheckEmail,
      errorFromServer
    } = this.props;
    const { getFieldError } = this.props.form;
    const { isOpenEmailModal, inValidAge, isShowValid, isEmptyDate, isEmptyJobtitle, isEmptyAddress, isEmptyPhone } = this.state;

    const renderInput = ({ getInputProps, getSuggestionItemProps, suggestions }: any) => (
      <div className="autocomplete-root">
        <input className="form-control" {...getInputProps()} placeholder="Ex: Philadelphia, Pennsylvania, United States" value={this.state.address} />
        <div className={`autocomplete-dropdown-container ${suggestions.length > 0 ? "has-location" : ""}`}>
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
      componentRestrictions: { country: "" }
    }
    return (
      <div className="row d-flex justify-content-center">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="switchable__text">
            <form onSubmit={this.handleOnSubmit}>
              <div className="row">
                <div className="form-group col-12 col-md-12 text-left">
                  <span>{this.username.label}</span>
                  <input
                    type="text"
                    placeholder={this.username.placeholder}
                    {...getFieldProps(this.username.name, this.username.options)}
                  />
                  <div>{this.renderErrorSection(this.username.name)}</div>
                </div>
                <div className="form-group col-12 col-md-6">
                  <span>{this.firstname.label}</span>
                  <input
                    type={this.firstname.type}
                    placeholder={this.firstname.placeholder}
                    autoFocus
                    tabIndex={1}
                    {...getFieldProps(this.firstname.name, this.firstname.options)}
                  />
                  <div className="form-group-error">{this.renderErrorSection(this.firstname.name)}</div>
                </div>
                <div className="form-group col-12 col-md-6">
                  <span>{this.lastname.label}</span>
                  <input
                    type={this.lastname.type}
                    placeholder={this.lastname.placeholder}
                    tabIndex={2}
                    {...getFieldProps(this.lastname.name, this.lastname.options)}
                  />
                  <div className="form-group-error">{this.renderErrorSection(this.lastname.name)}</div>
                </div>

                <div className={`form-group col-12 col-md-6 ${styles['email-group']}`}>
                  <span className="input-label">{this.email.label}</span>
                  <div className={styles['input-email']}>
                    <span className={styles['form-email-disable']}>{userInfo && userInfo.email}</span>
                    <a href="#" onClick={this.toggleEmailModal}>
                      Edit
                    </a>
                  </div>
                  <div className="form-group-error">{this.renderErrorSection(this.email.name)}</div>
                </div>
                <div className="form-group col-12 col-md-6">
                  <span>{this.job_title.label}</span>
                  <input
                    type="text"
                    placeholder={this.job_title.placeholder}
                    {...getFieldProps(this.job_title.name, this.job_title.options)}
                  />
                  <div className="form-group-error">
                    {isEmptyJobtitle ? (
                      <div className="custom-form-error text-danger">{this.job_title.options.rules[0].message}</div>
                    ) : (
                        this.renderErrorSection(this.job_title.name)
                      )}
                  </div>
                </div>
                <div className="form-group col-12 col-md-12">
                  <span>Current Location*</span>
                  <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChangeAddress}
                    onSelect={this.handleSelectAddress}
                    // Pass the search options prop
                    searchOptions={searchOptions}
                    debounce={800}

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
                <div className="form-group col-12 col-12 text-left">
                  <span>{this.portfolio.label}</span>
                  <input
                    type="text"
                    placeholder={this.portfolio.placeholder}
                    {...getFieldProps(this.portfolio.name, this.portfolio.options)}
                  />
                  <div>{this.renderErrorSection(this.portfolio.name)}</div>
                </div>
                <div style={{ display: 'none' }}>
                  <LocationAutoComplete
                    country={this.state.country}
                    state={this.state.state}
                    countryName={this.state.countryName}
                    stateName={this.state.stateName}
                    cityName={this.state.cityName}
                    setInputValue={this.setInputValue}
                    city={this.state.city}
                    setLocation={this.setLocation}
                    setCountryCode={this.setCountryCode}
                    renderErrorSection={isShowValid ? this.renderErrorAutoComplete : () => { }}
                    getFieldProps={getFieldProps}
                  />
                </div>
                {/* age */}
                <div className="form-group col-12 col-md-6">
                  <span>{this.date_of_birth.label}</span>
                  {/* <input
                    type="text"
                    placeholder={this.age.placeholder}
                    tabIndex={4}
                    {...getFieldProps(this.age.name, this.age.options)}
                  /> */}
                  <div className={styles['input-age']}>
                    <DatePicker
                      selected={isEmptyDate ? '' : this.state.date_of_birth}
                      dateFormat="MM/dd/yyyy"
                      onChange={this.handleChange}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={
                        new Date(
                          moment()
                            .subtract(99, 'years')
                            .format('MM/DD/YYYY')
                        )
                      }
                      maxDate={
                        new Date(
                          moment()
                            .subtract(13, 'years')
                            .format('MM/DD/YYYY')
                        )
                      }
                    />
                    {inValidAge ? <span className={styles['span-age']}>Age must be between 13 and 99</span> : null}
                  </div>
                  <div className="form-group-error">{this.renderErrorSection(this.date_of_birth.name)}</div>
                  <div className="form-group-error">
                    {isEmptyDate ? (
                      <div className="custom-form-error text-danger">{this.date_of_birth.options.rules[0].message}</div>
                    ) : (
                        this.renderErrorSection(this.date_of_birth.name)
                      )}
                  </div>
                </div>
                <div className="form-group col-12 col-md-6">
                  <span>{this.phone.label}</span>
                  <input
                    type="text"
                    onInput={this.maskPhoneInput}
                    placeholder={this.phone.placeholder}
                    onFocus={() => {
                      this.focusPhone();
                    }}
                    onKeyPress={this.autoMoveCaretAtEnd}
                    value={this.state.phone.value}
                    onBlur={e => this.checkPhone(e)}
                    tabIndex={5}
                    {...getFieldProps(this.phone.name)}
                  />
                  {isEmptyPhone ? (
                    <div className="form-group-error">
                      <div className="custom-form-error text-danger">{this.phone.options.rules[0].message}</div>
                    </div>
                  ) : (
                      this.renderErrorSection(this.phone.name)
                    )}
                  {!this.state.phone.isValid ? (
                    <div className="form-group-error">
                      <div className="custom-form-error text-danger">{this.state.phone.error}</div>
                    </div>
                  ) : null}
                </div>
                {/* Employment status */}
                <div className="form-group col-12 col-md-6">
                  <span>{this.employmentStatus.label}</span>
                  <div className="input-select">
                    <select tabIndex={6} {...getFieldProps(this.employmentStatus.name, this.employmentStatus.options)}>
                      {Object.keys(EmploymentStatusEnum).map((option: any, index: any) => {
                        return (
                          <option key={index} value={option}>
                            {EmploymentStatusEnum[option]}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group-error">{this.renderErrorSection(this.employmentStatus.name)}</div>
                </div>
                {/* Seeking status */}
                <div className="form-group col-12 col-md-6">
                  <span>{this.seekingStatus.label}</span>
                  <div className="input-select">
                    <select tabIndex={7} {...getFieldProps(this.seekingStatus.name, this.seekingStatus.options)}>
                      {Object.keys(SeekingStatusEnum).map((option: any, index: any) => {
                        return (
                          <option key={index} value={SeekingStatusEnum[option]}>
                            {SeekingStatusEnum[option]}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group-error">{this.renderErrorSection(this.seekingStatus.name)}</div>
                </div>
              </div>
              <div className={`${styles['padding-side']} row`}>
                {errorFromServer ? (
                  <div className="form-group col-12">
                    <FormError text={errorFromServer} />
                  </div>
                ) : null}
                <div className="form-group col-12 d-flex justify-content-center align-items-center">
                  <LoadingButton
                    isLoading={isLoading}
                    className={`btn-save-form`}
                    type="submit"
                    text="Save"
                    tabIndex={7}
                    handleClick={this.handleOnSubmit}
                  />
                </div>
              </div>
            </form>
            <Modal isOpen={isOpenEmailModal} toggleModal={this.toggleEmailModal}>
              <EnhanceEmailForm
                userInfo={userInfo}
                wrappedComponentRef={(inst: any) => (this.formRefEmail = inst)}
                handleSubmitAction={this.handleEmailSubmit}
                actionCheckEmail={actionCheckEmail}
                title="Change Email Address"
              />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonalForm;
