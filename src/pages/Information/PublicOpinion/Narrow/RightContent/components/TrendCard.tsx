import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { getNewSentimentTrend } from '../service';
import type { TrendItemType } from '../service';
import styles from '../index.less';

// 增长趋势卡片
const TrendCard = () => {
  const [dataInfo, setDataInfo] = useState<TrendItemType>({});

  const getDataInfo = useCallback(async () => {
    const result = await getNewSentimentTrend();
    setDataInfo(result || {});
  }, []);

  useEffect(() => {
    getDataInfo();
  }, []);

  return (
    <ProCardPlus
      title="舆情事件增长趋势"
      style={{ height: '140px' }}
      layout="center"
      className={styles['trend-wrap']}
    >
      <Row justify="center" style={{ width: '100%' }}>
        <Col span={6}>
          <div className={styles['card-value']}>{dataInfo.todayEventCount || 0}</div>
          <div className={styles['card-label']}>今日</div>
        </Col>
        <Col span={6}>
          <div className={styles['card-value']}>{dataInfo.weekEventCount || 0}</div>
          <div className={styles['card-label']}>近一周</div>
        </Col>
        <Col span={6}>
          <div className={styles['card-value']}>{dataInfo.monthEventCount || 0}</div>
          <div className={styles['card-label']}>近一月</div>
        </Col>
        <Col span={6}>
          <div className={styles['card-value']}>{dataInfo.yearEventCount || 0}</div>
          <div className={styles['card-label']}>近一年</div>
        </Col>
      </Row>
    </ProCardPlus>
  );
};
TrendCard.isProCard = true;

export default TrendCard;
