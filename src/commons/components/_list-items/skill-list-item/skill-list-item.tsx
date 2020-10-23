import React from 'react';
import styles from './skill-list-item.module.scss';

interface SkillListItemPropTypes {
  data: any;
}
const countLevel = [1, 2, 3, 4, 5];
export const SkillListItem = (props: SkillListItemPropTypes) => {
  const { data } = props;
  let renderLevel = () => {
    let activeLV = data.level;
    let _width = (activeLV / 5) * 100;
    return (
      <div className={`${styles['skillLevel']}`}>
        <div
          style={{
            width: _width + '%',
            backgroundColor: '#5bbbae',
            position: 'absolute',
            height: '10px',
            borderRadius: 8
          }}
        />
      </div>
    );
  };
  return (
    <div className={`${styles['skill-item']}`}>
      <div style={{ width: '50%' }}>
        <p className="sidebar-skill-name"> {data.name}</p>
      </div>
      <div className="sidebar-skill-level">{renderLevel()}</div>
    </div>
  );
};
