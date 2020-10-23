import React from 'react';
import styles from './interest-list-item.module.scss';

interface InterestListItemPropTypes {
  data: any;
}

export const InterestListItem = (props: InterestListItemPropTypes) => {
  const { data } = props;
  return (
    <div className="interest-item">
      <div className="group-interest-icon">
        <img className="interest-icon" width={25} src={data.image_url} />
      </div>
      <p className="interest-name">{data.name}</p>
    </div>
  );
};
