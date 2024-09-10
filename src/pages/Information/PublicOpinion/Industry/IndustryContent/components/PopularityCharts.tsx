/**
 * 热度图标
 */
import React, { useMemo } from 'react';
import { Line, LineConfig } from '@ant-design/charts';
import { Empty } from 'antd';
import { ITrendChartsPropsType } from '../data.d';
import styles from '../index.less';

const PopularityCharts: React.FC<ITrendChartsPropsType> = ({ data }) => {
  const chartConfig: LineConfig = useMemo(() => {
    return {
      data: data ?? [],
      padding: 'auto',
      xField: 'clusterEventDate', //clusterEventDate
      yField: 'resultValue', //resultValue
      style: {
        height: 250,
      },
      meta: {
        resultValue: {
          alias: '热度',
        },
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

  return <Line {...chartConfig} />;
};

export default PopularityCharts;
