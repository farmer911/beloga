import React from 'react';
import { EducationType } from '../../../types/view-model';
import styles from './user-card-education.module.scss';

interface UserCardEducationPropTypes {
  data: EducationType;
}

export const UserCardEducation = (props: UserCardEducationPropTypes) => {
  const { school_name, description, to_date_year, from_date_year } = props.data;
  return (
    <div className={` ${styles['education-item']}`}>
      <h5 className="no-margin-bottom">{school_name}</h5>
      <p className={`no-margin-bottom ${styles['small-text']}`}>{description}</p>
      <p className={styles['small-text']}>{`${from_date_year} - ${to_date_year}`}</p>
    </div>
  );
};
