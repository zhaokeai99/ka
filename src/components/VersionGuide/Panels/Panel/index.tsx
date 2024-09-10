import React from 'react';
import styles from './index.less';

const Panel: React.FC<any> = (props: any) => {
  const { data = {} } = props || {};

  return (
    <div className={styles['panel-container']}>
      <img className={styles['img']} src={data.picUrl} />
      <div className={styles['title']}>{data.title}</div>
      <div className={styles['content']}>{data.content}</div>
    </div>
  );
};

export default Panel;
