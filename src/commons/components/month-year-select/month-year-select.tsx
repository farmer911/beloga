import React, { Component } from 'react';
import { generateYears } from '../../../utils';
import styles from './month-year-select.module.scss';
import { MONTHS } from '../../constants';

interface MonthYearSelectPropTypes {
  value: {
    fromMonth: number;
    fromYear: number;
  };
  onChange: any;
}

export class MonthYearSelect extends Component<MonthYearSelectPropTypes> {
  years = generateYears(1965, new Date().getFullYear(), true);

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
        <div className="row">
          <label className="col-12 col-md-6 com-form-label">Completion Date</label>
          <label className="col-12 col-md-6 com-form-label" />
          <div className="col-12 col-md-6">
            <div
              className={`input-select ${styles['custom-input-select']}`}
              style={{ marginBottom: window.innerWidth < 768 ? 10 : undefined }}
            >
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
          </div>
         
          <div className="col-12 col-md-6">
            <div
              className={`input-select ${styles['custom-input-select']}`}
              style={{ marginBottom: window.innerWidth < 768 ? 10 : undefined }}
            >
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
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="row">
        <div className="col-12">{this.renderFrom()}</div>
      </div>
    );
  }
}
