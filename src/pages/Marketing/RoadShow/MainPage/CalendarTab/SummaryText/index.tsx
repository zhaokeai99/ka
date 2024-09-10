import React, { memo } from 'react';
import styles from './index.less';

const RightItem: React.FC<any> = ({ data }) => {
  return (
    <div className={styles[`container`]}>
      <div className={styles[`item-icon-${data.type}`]}></div>
      <div className={styles['item-label']}>{data.title}</div>
      <div className={styles[`item-data`]}>{data.data}</div>
    </div>
  );
};

export default memo(RightItem);
