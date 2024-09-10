import React, { memo } from 'react';
import ShowItem from './ShowItem';
import styles from './index.less';

const ShowList: React.FC<any> = (props = {}) => {
  const { datas, onDetail, onEdit, onCancel } = props;
  const empty = !datas || datas.length === 0;
  return (
    <div className={styles[`container`]}>
      {datas &&
        datas.map((item) => {
          return <ShowItem data={item} onDetail={onDetail} onEdit={onEdit} onCancel={onCancel} />;
        })}
      {empty && <span className={styles[`empty`]}>暂无路演信息！</span>}
    </div>
  );
};

export default memo(ShowList);
