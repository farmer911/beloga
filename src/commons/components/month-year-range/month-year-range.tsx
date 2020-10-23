import React, { Component } from 'react';
import { generateYears } from '../../../utils';
import styles from './month-year-range.module.scss';
import { Checkbox } from '..';
import { MONTHS } from '../../constants';

interface MonthYearRangePropTypes {
  value: {
    fromMonth: number;
    fromYear: number;
    toMonth: number;
    toYear: number;
    currentlyWorkHere: boolean;
  };
  checkboxLabel: string;
  onChange: any;
}

export class MonthYearRange extends Component<MonthYearRangePropTypes> {
  years = generateYears(1965, new Date().getFullYear(), true);

  onCheckboxChange = (e: any) => {
    const { value, onChange } = this.props;
    const checked = e.target.checked;
    const newValue = {
      ...value,
      toMonth: checked ? null : 11,
      toYear: checked ? null : new Date().getFullYear(),
      currentlyWorkHere: checked
    };
    onChange(newValue);
  };

  onValueChange = (updatedValue: any, propName: string) => {
    const { value, onChange } = this.props;
    const newValue = {
      ...value,
      [propName]: updatedValue
    };
    onChange(newValue);
  };

  renderFrom = () => {
    const { fromMonth, fromYear } = this.props.value;
    return (
      <React.Fragment>
        {/* from month */}
        <label>From</label>
        <div className={`input-select ${styles['custom-input-select']}`}>
          <select value={fromMonth} onChange={(e: any) => this.onValueChange(e.target.value, 'fromMonth')}>
            {MONTHS.map((month: any, index: number) => {
              return (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              );
            })}
          </select>
        </div>
        {/* from year */}
        <div className={`input-select ${styles['custom-input-select']}`}>
          <select
            value={fromYear}
            onChange={(e: any) => this.onValueChange(e.target.value, 'fromYear')}
            className={styles['margin-top']}
          >
            {this.years.map((year: number, index: number) => {
              return (
                <option key={index} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </React.Fragment>
    );
  };

  renderTo = () => {
    const { toMonth, toYear, currentlyWorkHere } = this.props.value;
    return currentlyWorkHere ? null : (
      <React.Fragment>
        {/* to month */}
        <label>To</label>
        <div className={`input-select ${styles['custom-input-select']}`}>
          <select value={toMonth} onChange={(e: any) => this.onValueChange(e.target.value, 'toMonth')}>
            {MONTHS.map((month: any, index: number) => {
              return (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              );
            })}
          </select>
        </div>
        <div className={`input-select ${styles['custom-input-select']}`}>
          <select
            value={toYear}
            onChange={(e: any) => this.onValueChange(e.target.value, 'toYear')}
            className={styles['margin-top']}
          >
            {this.years.map((year: number, index: number) => {
              return (
                <option key={index} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const {
      checkboxLabel,
      value: { currentlyWorkHere }
    } = this.props;
    return (
      <React.Fragment>
        <div className={`form-group col-12 col-md-12 group-checkbox`}>
          <Checkbox label={checkboxLabel} checked={currentlyWorkHere} onChange={this.onCheckboxChange} />
        </div>
        <div className="form-group col-6">{this.renderFrom()}</div>

        <div className="form-group col-6"> {this.renderTo()}</div>
      </React.Fragment>
    );
  }
}
