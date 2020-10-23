import React from 'react';
import styles from './certification-list-item.module.scss';
import { buildMonthYearStr } from '../../../../utils';

interface CertificationListItemPropTypes {
  data: any;
  onEdit?: any;
  onDelete?: any;
  mode?: 'readonly' | 'editable';
}

export const CertificationListItem = (props: CertificationListItemPropTypes) => {
  const handleEdit = () => {
    const { data, onEdit } = props;
    onEdit(data.id, data);
  };

  const handleDelete = () => {
    const { data, onDelete } = props;
    onDelete(data.id);
  };

  const {
    title,
    description,
    currently_work_here,
    to_date_month,
    to_date_year,
    from_date_month,
    from_date_year,
    image_url
  } = props.data;
  const { mode } = props;
  return (
    <div className={` ${styles['certification-item']}`}>
      <div className="row">
        <div className="col-3 col-sm-3 col-md-3 col-lg-2">
          {/* sample image, remove when using real data */}
          <img className={styles['image-style']} src={image_url} />
        </div>
        <div className="col-9 col-sm-9 col-md-9 col-lg-10">
          <h5 className="com-block-title">
            <span className="line-title">{title}</span>
            {mode === 'editable' ? (
              <div className="icon-wrapper">
                <span className="icon-edit" onClick={handleEdit} title="Edit" />
                <span className="icon-remove" onClick={handleDelete} title="Remove" />
              </div>
            ) : null}
          </h5>
          <p className="com-block-daterange">
            {from_date_month} {from_date_year}
          </p>
          <p className="com-block-description">{description}</p>
        </div>
      </div>
    </div>
  );
};
