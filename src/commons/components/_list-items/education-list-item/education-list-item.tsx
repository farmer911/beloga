import React from 'react';
import styles from './education-list-item.module.scss';
import { buildMonthYearStr } from '../../../../utils';

interface EducationListItemPropTypes {
  data: any;
  onEdit?: any;
  onDelete?: any;
  mode?: 'readonly' | 'editable';
}

export const EducationListItem = (props: EducationListItemPropTypes) => {
  const {
    school_name,
    description,
    from_date_year,
    from_date_month,
    to_date_month,
    to_date_year,
    degree_name,
    currently_work_here,
    image_url,
    url,
    address,
    gpa
  } = props.data;
  const { mode = 'editable' } = props;

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
    <div className={` ${styles['education-item']}`}>
      <div className="row">
        <div className="col-3 col-sm-3 col-md-3 col-lg-2">
          {url ? (
            <a href={url} target="_blank">
              <img className={styles['image-style']} src={image_url} />
            </a>
          ) : (
            <img className={styles['image-style']} src={image_url} />
          )}
        </div>
        <div className="col-9 col-sm-9 col-md-9 col-lg-10">
        <h5 className="com-block-title">
            {mode === 'editable' ? (
              <div>
              <p className="line-title editable">
                {school_name} | {degree_name}
              </p>
              <a className='location-link-maps-edit' href={"https://maps.google.com/?q="+address} target="_blank">{address}</a>
              </div>
            ) : (
                <div>
                <p className="line-title">
                {school_name} | {degree_name}
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
          {/* {mode === 'editable' ? (
            <a className="location-link-maps">
              {address}
            </a>
          ) : null} */}
          <p className="com-block-daterange">
            {buildMonthYearStr(currently_work_here, from_date_month, from_date_year, to_date_month, to_date_year)}
            {gpa ? <span> | {gpa} GPA</span> : ''}
          </p>
          
          <p className="com-block-description">{description}</p>
        </div>
      </div>
    </div>
  );
};
