import React from 'react';
import styles from './step.module.scss';

interface StepPropTypes {
  title: string;
  status?: string;
  itemWidth?: string;
  stepNumber?: number;
}

export const Step = (props: StepPropTypes) => {
  const { title, status, itemWidth, stepNumber } = props;
  return (
    <li style={{ width: itemWidth }} className={`step ${status}`}>
      <a>
        {status === 'finish' ? (
          <span className="step-finish">
            <img src="/images/icons/check-white.svg" />
          </span>
        ) : (
          <span className="step-number">{stepNumber}</span>
        )}
        <span className="step-title">{title}</span>
      </a>
    </li>
  );
};
