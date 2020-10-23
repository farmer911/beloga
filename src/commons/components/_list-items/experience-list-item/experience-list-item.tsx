import React from 'react';
import styles from './experience-list-item.module.scss';
import { buildMonthYearStr } from '../../../../utils';

interface ExperienceListItemPropTypes {
  data: any;
  onEdit?: any;
  onDelete?: any;
  mode?: 'readonly' | 'editable';
}

export const ExperienceListItem = (props: ExperienceListItemPropTypes) => {
  const {
    title,
    company_name,
    description,
    currently_work_here,
    from_date_month,
    to_date_month,
    from_date_year,
    to_date_year,
    image_url,
    address,
    url
  } = props.data;
  const { mode } = props;
  const handleEdit = () => {
    const { data, onEdit } = props;
    let _data = {...data}
    const HTTP_REGREX = /^(http):/g;
    const HTTPS_REGREX = /^(https):/g;
    if(_data.url.match(HTTP_REGREX)){
      _data.url = _data.url.slice(7)
    }
    if(_data.url.match(HTTPS_REGREX)){
      _data.url = _data.url.slice(8)
    }
    onEdit(_data.id, _data);
  };
  const handleDelete = () => {
    const { data, onDelete } = props;
    onDelete(data.id);
  };
  return (
    <div className="row row-item">
      <div className="col-3 col-sm-3 col-md-3 col-lg-2">
        {url ? (
          <a href={url} target="_blank">
            <img className={styles['image-style']} src={image_url} />{' '}
          </a>
        ) : (
            <img className={styles['image-style']} src={image_url} />
          )}
      </div>
      <div className="col-9 col-sm-9 col-md-9 col-lg-10">
        <div className={styles['description-wrapper']}>
          <h5 className="com-block-title">
            {mode === 'editable' ? (
              <div>
              <p className="line-title line-title editable">
                {title} | {company_name}
              </p>
              <a className='location-link-maps-edit' href={"https://maps.google.com/?q="+address} target="_blank">{address}</a>
              </div>
            ) : (
                <div>
                <p className="line-title">
                  {title} | {company_name}
                </p>
                <a className='location-link-maps' href={"https://maps.google.com/?q="+address} target="_blank">{address}</a>
                </div>
              )}
            {mode === 'editable' ? (
              <div className="icon-wrapper">
                <span className="icon-edit" onClick={handleEdit} title="Edit" />
                <span className="icon-remove" onClick={handleDelete} title="Remove" />
              </div>
            ) : null}
          </h5>
          <p className="com-block-daterange">
            {buildMonthYearStr(currently_work_here, from_date_month, from_date_year, to_date_month, to_date_year)}
          </p>
          <p className="com-block-description">{description}</p>
        </div>
      </div>
    </div>
  );
};
