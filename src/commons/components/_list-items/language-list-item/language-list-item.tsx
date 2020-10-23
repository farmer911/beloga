import React from 'react';
import styles from '../language-list-item/language-list-item.module.scss';

interface LanguageListItemPropTypes {
  data: any;
}
const countLevel = [1, 2, 3, 4, 5];
export const LanguageListItem = (props: LanguageListItemPropTypes) => {
  const { data } = props;
  // console.log('data', data);
  let renderLevel = () => {
    let activeLV = data.level;
    let count = 0;
    return countLevel.map((item, index) => {
      count++;
      if (count <= activeLV) return <div key={index} className={`${styles['languageLevel']} ${styles['active']}`} />;
      return <div className={`${styles['languageLevel']}`} />;
    });
  };
  return (
    <div className={`${styles['skill-item']}`}>
      <div style={{ width: '50%' }}>
        <p className="sidebar-language-name">{data.name}</p>
      </div>
      <div className={`${styles['sidebar-language-level']}`}>{renderLevel()}</div>
    </div>
  );
};
