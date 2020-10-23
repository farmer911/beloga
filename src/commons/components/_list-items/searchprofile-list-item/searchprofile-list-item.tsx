import React from 'react';
import styles from './searchprofile-list-item.module.scss';

interface SearchProfileListItemPropTypes {
  data: any;
}

export const SearchProfileListItem = (props: SearchProfileListItemPropTypes) => {
  const { data } = props;
  return (
    <div className="searchprofile-item">
      <div className="group-searchprofile-icon">
        <img className="searchprofile-icon" width={25} src={data.image_url} />
      </div>
      <p className="searchprofile-name">{data.name}</p>
    </div>
  );
};
