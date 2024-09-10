import React from 'react';
import { Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import { WarningFilled } from '@ant-design/icons';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import Cumulative from './Cumulative';
import styles from './index.less';

interface dataType {
  data: any;
  type: string;
}

const ChartItem = ({ data, type }: dataType) => {
  const randerTitle = ({ abnormalSignal, title }: any) => {
    return (
      <>
        {title}
        {abnormalSignal ? (
          <>
            &nbsp;&nbsp;
            <WarningFilled title="异动" style={{ color: COLORENUM?.red6 }} />
          </>
        ) : null}
      </>
    );
  };

  if (!data[type] || data[type]?.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <ProCard wrap gutter={[8, 8]} className={styles['chart-item']}>
      {data[type]?.map((item: any, index: number) => (
        <ProCard
          bordered
          size="small"
          colSpan={12}
          key={index}
          title={randerTitle(item)}
          className={styles['column-chart-card']}
        >
          <Cumulative data={item?.data} />
        </ProCard>
      ))}
    </ProCard>
  );
};

export default ChartItem;
