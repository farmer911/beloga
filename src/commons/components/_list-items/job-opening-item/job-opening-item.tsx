import React from 'react';
import styles from './job-opening-item.module.scss';
import { JobOpeningType } from '../../../types/view-model';

interface JobOpeningItemPropTypes {
  data: JobOpeningType;
}

export const JobOpeningItem = (props: JobOpeningItemPropTypes) => {
  const { imgSource, title, detail } = props.data;

  const clickDetail = () => {};

  return (
    <div>
      <div className="row">
        <div className="col-4 col-ms-12">
          <img className={`${styles['img']}`} alt="Icon job opening" src={imgSource} />
        </div>
        <div className="col-8 col-ms-12">
          <h5 className={styles['title']}>{title}</h5>
          <p>{detail}</p>
        </div>
      </div>
      <a onClick={clickDetail} className={styles['see-more']}>
        See more <i className="stack-right-open" />
      </a>
    </div>
  );
};
