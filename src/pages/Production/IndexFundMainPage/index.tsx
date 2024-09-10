import React, { useState, useCallback } from 'react';
import { Radio, DatePicker } from 'antd';
import { GUTTER_SIZE } from '@/utils/utils';
import styles from './index.less';
import ProCardPlus from '@/components/ProCardPlus';
import EtfPage from './EtfPage';
import { useModel } from 'umi';
import moment from 'moment';

export default function () {
  const [fundType, setFundType] = useState('0');
  const { dateInfo, handleChange } = useModel('useIndexFundMainPageModal');

  const getPageDom = useCallback(() => {
    switch (fundType) {
      case '0':
        return <EtfPage />;
      default:
        return <EtfPage />;
    }
  }, [fundType]);
  return (
    <ProCardPlus
      style={{ padding: '0 12px' }}
      ghost
      direction="column"
      gutter={[0, GUTTER_SIZE]}
      size="small"
      className={styles['IndexFundMainPage']}
    >
      <div className={styles['header']}>
        <div>
          <span className={styles['title']}>ETF实时大盘</span>
          <Radio.Group
            size="middle"
            defaultValue="0"
            buttonStyle="solid"
            onChange={(val: any) => setFundType(val.target.value)}
          >
            <Radio.Button value="0">ETF指数</Radio.Button>
          </Radio.Group>
        </div>
        {/* <span className={styles['deal-date']}>交易确认日期: {dateInfo?.date}</span> */}
        <div>
          <span className={styles['deal-date']}>交易确认日期: </span>
          <DatePicker
            style={{ width: 200 }}
            allowClear={false}
            value={dateInfo?.date ? moment(dateInfo?.date) : undefined}
            onChange={(_, dateString) => {
              // console.log('dateString', dateString);
              handleChange(dateString);
            }}
          />
        </div>
      </div>
      {getPageDom()}
    </ProCardPlus>
  );
}
