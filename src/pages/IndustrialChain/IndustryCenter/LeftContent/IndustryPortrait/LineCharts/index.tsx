import React, { useContext, useMemo } from 'react';
import { Empty } from 'antd';
import { Line } from '@ant-design/charts';
import { IndustryProvider } from '@/pages/IndustrialChain/IndustryCenter/service';

interface propsType {
  data: any[];
}

const LineCharts = (props: propsType) => {
  const { industryName } = useContext(IndustryProvider);

  const config: any = useMemo(
    () => ({
      data: props?.data,
      xField: 'tDate',
      yField: 'subfeatureScore',
      slider: {},
      meta: {
        subfeatureScore: {
          alias: '评分',
          nice: true,
        },
      },
      appendPadding: [15, 12],
      legend: false,
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      style: {
        height: '300px',
      },
      columnWidthRatio: 0.4,
      maxColumnWidth: 40,
    }),
    [props?.data, industryName],
  );

  if (props?.data?.length <= 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <Line {...config} />;
};

export default LineCharts;
