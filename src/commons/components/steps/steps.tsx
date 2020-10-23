import React, { Component, cloneElement } from 'react';
import styles from './steps.module.scss';

interface StepsPropTypes {
  children?: any;
  initial: number;
  current: number;
}

export class Steps extends Component<StepsPropTypes> {
  static defaultProps: Partial<StepsPropTypes> = {
    initial: 0
  };
  render() {
    const { children, initial, current } = this.props;
    const nodeLength = children.length;
    return (
      <div className={`${styles['wizard']} ${styles['clearfix']} ${styles['active']}`}>
        <div className={`${styles['steps']} ${styles['clearfix']}`}>
          <ul>
            {children.map((child: any, index: number) => {
              if (!child) {
                return null;
              }
              const stepNumber = initial + index + 1;
              const childProps = {
                stepNumber: stepNumber,
                itemWidth: `${100 / nodeLength}%`,
                key: index,
                ...child.props
              };

              if (!child.props.status) {
                if (stepNumber === current) {
                  childProps.status = 'current';
                } else if (stepNumber < current) {
                  childProps.status = 'finish';
                } else {
                  childProps.status = 'wait';
                }
              }
              return cloneElement(child, childProps);
            })}
          </ul>
        </div>
      </div>
    );
  }
}
