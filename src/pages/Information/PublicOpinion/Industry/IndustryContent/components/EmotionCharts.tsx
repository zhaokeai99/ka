/**
 * 情绪图标
 */
import React, { useMemo } from 'react';
import { Empty } from 'antd';
import { Column, ColumnConfig } from '@ant-design/charts';
import { ITrendChartsPropsType, COLORINDUSTRYENUM } from '../data.d';
import styles from '../index.less';

const COLORTYPE = {
  利好: COLORINDUSTRYENUM['red6'],
  中性: COLORINDUSTRYENUM['gray'],
  利空: COLORINDUSTRYENUM['green5'],
};

const EmotionCharts: React.FC<ITrendChartsPropsType> = ({ data }) => {
  const chartConfig: ColumnConfig = useMemo(() => {
    return {
      data: data || [],
      xField: 'clusterEventDate',
      yField: 'resultValue',
      seriesField: 'publicSentiment',
      groupField: 'publicSentiment',
      isStack: true,
      color: ({ publicSentiment }: Record<string, any>) => COLORTYPE?.[publicSentiment],
      style: {
        height: 250,
      },
      maxColumnWidth: 24,
      legend: {
        layout: 'horizontal',
        position: 'top-left',
        offsetX: 0,
        offsetY: 0,
      },
    };
  }, [data]);

  if (data?.length <= 0) {
    return (
      <div className={styles['trend-empty']}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return <Column {...chartConfig} />;
};

export default EmotionCharts;
