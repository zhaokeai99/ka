import React from 'react';
import styles from './index.less';

type PropsType = {
  title: string;
  extra?: any;
  style?: any;
  id?: string;
};

const Title = (props: PropsType) => {
  const { title, extra, style, id } = props;

  return (
    <div id={id} style={style} className={styles['container']}>
      <div className={styles['title']}>{title}</div>
      {extra}
    </div>
  );
};

export default Title;
