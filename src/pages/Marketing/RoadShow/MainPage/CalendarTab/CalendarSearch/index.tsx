import React, { memo, useState } from 'react';
import { Radio, Button } from 'antd';
import { STATUS, MY } from '../../../constant';
import styles from './index.less';

const CalendarSearch: React.FC<any> = (props = {}) => {
  const { onSearchChange } = props;
  const [status, setStatus] = useState(STATUS.ALL);
  const [my, setMy] = useState(MY.ALL);

  return (
    <div className={styles[`container`]}>
      <div className={styles[`search-container`]}>
        <span className={styles[`label`]}>路演状态：</span>
        <Radio.Group
          style={{ width: '240px' }}
          onChange={(e) => {
            setStatus(e.target.value);
            if (onSearchChange) {
              onSearchChange({ status: e.target.value, my: my });
            }
          }}
          value={status}
        >
          <Radio value={STATUS.ALL}>全部</Radio>
          <Radio value={STATUS.UNDONE}>待开始</Radio>
          <Radio value={STATUS.DONE}>已结束</Radio>
        </Radio.Group>
      </div>
      <div className={styles[`search-container`]}>
        <span className={styles[`label`]}>只看我的：</span>
        <Radio.Group
          style={{ width: '240px' }}
          onChange={(e) => {
            setMy(e.target.value);
            if (onSearchChange) {
              onSearchChange({ status: status, my: e.target.value });
            }
          }}
          value={my}
        >
          <Radio value={MY.ALL}>全部</Radio>
          <Radio value={MY.CREATE}>我创建</Radio>
          <Radio value={MY.PARTICIPATE}>我参加</Radio>
        </Radio.Group>
      </div>
      <div className={styles[`search-container-btn`]}>
        <Button
          style={{ marginRight: 24 }}
          type="primary"
          onClick={() => {
            if (onSearchChange) {
              onSearchChange({ status, my });
            }
          }}
        >
          查询
        </Button>
      </div>
      {/* <div className={styles[`search-next`]}>
        <a
          className={styles[`item`]}
          onClick={() => nextCall && nextCall(-1)}
        >
          上一月
        </a>
        <a
          className={styles[`item`]}
          onClick={() => nextCall && nextCall(1)}
        >
          下一月
        </a>
      </div> */}
    </div>
  );
};

export default memo(CalendarSearch);
