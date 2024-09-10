import React, { memo, useState } from 'react';
import { Radio, DatePicker, Input, Button } from 'antd';
import moment from 'moment';
import { STATUS, MY } from '../../../constant';

const { RangePicker } = DatePicker;

import styles from './index.less';

const getNewRanges = (ranges) => {
  if (ranges && ranges.length === 2) {
    return [moment(ranges[0]).startOf('day'), moment(ranges[1]).endOf('day')];
  }
  return ranges;
};

const CalendarSearch: React.FC<any> = (props = {}) => {
  const { onSearchChange } = props;
  const [searchWord, setSearchWord] = useState('');
  const [status, setStatus] = useState(STATUS.ALL);
  const [my, setMy] = useState(MY.ALL);
  // const [style, setStyle] = useState(STYLE.ALL);
  const [dateRange, setDateRange] = useState(null);

  return (
    <div className={styles[`container`]}>
      <div className={styles[`search-container`]}>
        <span className={styles[`label`]}>关键词：</span>
        <Input
          style={{ width: 160, marginRight: 20 }}
          placeholder="请输入搜索关键词"
          onChange={(e) => {
            const value = e.target.value;
            setSearchWord(value);
            if (onSearchChange) {
              onSearchChange({ searchWord: value, status, my, dateRange });
            }
          }}
        />
      </div>
      <div className={styles[`search-container`]}>
        <span className={styles[`label`]}>路演状态：</span>
        <Radio.Group
          style={{ width: '240px' }}
          onChange={(e) => {
            setStatus(e.target.value);
            if (onSearchChange) {
              onSearchChange({ status: e.target.value, my, searchWord, dateRange });
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
              onSearchChange({ status, my: e.target.value, searchWord, dateRange });
            }
          }}
          value={my}
        >
          <Radio value={MY.ALL}>全部</Radio>
          <Radio value={MY.CREATE}>我创建</Radio>
          <Radio value={MY.PARTICIPATE}>我参加</Radio>
        </Radio.Group>
      </div>
      {/* <div className={styles[`search-container`]}>
        <span className={styles[`label`]}>路演形式：</span>
        <Radio.Group
          style={{width: '240px'}}
          onChange={(e) => { setStyle(e.target.value);
            onSearchChange && onSearchChange({ status, my, style: e.target.value, dateRange })}}
          value={style}>
          <Radio value={STYLE.ALL}>全部</Radio>
          <Radio value={STYLE.ONLINE}>线上视频</Radio>
          <Radio value={STYLE.OFFLINE}>线下</Radio>
        </Radio.Group>
      </div> */}
      <div className={styles[`search-container`]}>
        <span className={styles[`label`]}>时间段：</span>
        <RangePicker
          onChange={(values) => {
            const newValues = getNewRanges(values);
            setDateRange(newValues);
            if (onSearchChange) {
              onSearchChange({ status, my, searchWord, dateRange: newValues });
            }
          }}
          value={dateRange}
        />
      </div>
      <div className={styles[`search-container-btn`]}>
        <Button
          style={{ marginRight: 8 }}
          type="primary"
          onClick={() => onSearchChange && onSearchChange({ status, my, searchWord, dateRange })}
        >
          查询
        </Button>
      </div>
    </div>
  );
};

export default memo(CalendarSearch);
