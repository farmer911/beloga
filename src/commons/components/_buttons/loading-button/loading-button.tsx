import React from 'react';
import { LoadingIcon } from '../../loading-icon/loading-icon';

interface LoadingButtonPropTypes {
  isLoading: boolean;
  handleClick?: any;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  tabIndex?: number;
}

export const LoadingButton = (props: LoadingButtonPropTypes) => {
  const { isLoading, handleClick, className = 'btn-save-form', type = 'button', text, tabIndex } = props;
  return (
    <button
      tabIndex={tabIndex}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'disabled' : ''}`}
      onClick={handleClick}
      type={type}
    >
      {isLoading ? <LoadingIcon /> : text}
    </button>
  );
};
