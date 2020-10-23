import React from 'react';
import sassVariable from '../styles/variables.module.scss';

const loadingWithConfig = (
  LoadingComponent: any,
  iconColor: string = sassVariable.mainColor,
  wrapperClassname: string = 'page-loading-wrapper',
  iconSize: number = 80
) => {
  // const Wrapper = iconWrapper;
  return (
    <div className={sassVariable[wrapperClassname]}>
      <LoadingComponent color={iconColor} size={iconSize} />
    </div>
  );
};

export default loadingWithConfig;
