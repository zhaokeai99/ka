import React from 'react';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';

const iconUrl = 'https://cdnprod.tianhongjijin.com.cn/thfile/no_permission_card1663233651034.png';

const NoPermissionCard = () => {
  return (
    <ProCard direction="column" layout="center" className={styles['no-permission-card']}>
      <img src={iconUrl} alt="" className={styles['icon']} />
      <div>暂无权限</div>
    </ProCard>
  );
};

export default NoPermissionCard;
