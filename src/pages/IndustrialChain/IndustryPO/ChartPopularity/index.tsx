import React, { useMemo } from 'react';
import { Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import { Line } from '@ant-design/plots';

interface propsType {
  data: [];
}

// 热度
const ChartPopularity = (props: propsType) => {
  const config = useMemo(() => {
    return {
      data: props?.data,
      appendPadding: [16, 0],
      xField: 'clusterEventDate',
      yField: 'resultValue',
      meta: {
        resultValue: {
          alias: '热度',
        },
      },
    };
  }, [props?.data]);

  if (!props.data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <ProCard size="small" gutter={[0, 8]} style={{ marginTop: 12 }}>
      <Line {...(config as any)} style={{ height: '370px' }} />
    </ProCard>
  );
};

export default ChartPopularity;
