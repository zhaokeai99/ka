import React, { useState, useEffect, useCallback } from 'react';
import { List, Col, Spin, Tooltip } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { getNewKeyBondTop } from '../service';
import type { BondTopItemType } from '../service';
import styles from '../index.less';

// Top5列表
const TopCard = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<BondTopItemType[]>([]);

  const getList = useCallback(async () => {
    setLoading(true);
    const result = await getNewKeyBondTop();
    setLoading(false);
    setList(result || []);
  }, []);

  useEffect(() => {
    getList();
  }, []);

  return (
    <ProCardPlus
      title="今日重点关注债券TOP5"
      style={{ height: '256px' }}
      loading={loading && <Spin spinning />}
    >
      <List
        size="small"
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <Col span={3} className={styles['text-ellipsis']}>
              TOP{item.orderNum}
            </Col>
            <Col span={7} className={styles['text-ellipsis']}>
              <Tooltip placement="top" title={item.bondCode}>
                {item.bondCode}
              </Tooltip>
            </Col>
            <Col span={8} className={styles['text-ellipsis']}>
              <Tooltip placement="top" title={item.bondName}>
                {item.bondName}
              </Tooltip>
            </Col>
            <Col span={3} className={styles['text-ellipsis']}>
              {item.innerRating}
            </Col>
            <Col span={3} className={styles['text-ellipsis']}>
              {item.outerRating}
            </Col>
          </List.Item>
        )}
      />
    </ProCardPlus>
  );
};

TopCard.isProCard = true;

export default TopCard;
