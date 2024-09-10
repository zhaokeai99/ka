import React, { useState, useEffect, useCallback } from 'react';
import { Pie } from '@ant-design/charts';
import ProCardPlus from '@/components/ProCardPlus';
import type { PieConfig } from '@ant-design/charts';
import { Empty } from 'antd';
import { getNewOfflineSentimentDistribution } from '../service';

// 舆情分布图
const PieCard = () => {
  const [config, setConfig] = useState<PieConfig>({
    angleField: 'eventCount',
    colorField: 'sentType',
    radius: 0.6,
    innerRadius: 0.4,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
    },
    legend: {
      position: 'left',
      offsetX: 48,
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: false,
    },
    data: [],
  });

  const getList = useCallback(async () => {
    const result = await getNewOfflineSentimentDistribution();
    setConfig((preState) => {
      return {
        ...preState,
        data: result || [],
      };
    });
  }, []);

  useEffect(() => {
    getList();
  }, []);

  return (
    <ProCardPlus title="最新离线舆情分布" style={{ height: '430px' }} layout="center">
      {config.data.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Pie {...config} />
      )}
    </ProCardPlus>
  );
};

PieCard.isProCard = true;

export default PieCard;
