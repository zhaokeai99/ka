import React, { memo } from 'react';
import { Badge } from 'antd';
import styles from './index.less';

const BadgeArea: React.FC<any> = () => {
  return (
    <div className={styles[`container`]}>
      <Badge status="success" className={styles[`info`]} text={'已结束'} />
      <Badge status="warning" className={styles[`info`]} text={'待开始'} />
      <Badge status="processing" className={styles[`info`]} text={'进行中'} />
      <Badge status="error" className={styles[`info`]} text={'已取消'} />
    </div>
  );
};

export default memo(BadgeArea);
