import React from 'react';
import styles from './index.less';

type PropsType = {
  name: '';
};

const Icons = (props: PropsType) => {
  const { name } = props;
  return (
    <div className={styles['research_trends_icon']}>
      <span className={styles['research_trends_icon_span']} title={name}>
        {name}
      </span>
    </div>
  );
};

export default {
  Icons,
};
