import React, { useContext, useMemo } from 'react';
import { Empty } from 'antd';
import { Column } from '@ant-design/charts';
import { IndustryProvider } from '@/pages/IndustrialChain/IndustryCenter/service';

interface propsType {
  data: any[];
}

const ColumnCharts = (props: propsType) => {
  const { industryName } = useContext(IndustryProvider);

  const config: any = useMemo(
    () => ({
      data: props?.data,
      xField: 'industryName',
      yField: 'subfeatureScore',
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
      color: (item: any) => {
        if (item.industryName === industryName) {
          return '#f08bb4';
        } else {
          return '#5b8ff9';
        }
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

  return <Column {...config} />;
};

export default ColumnCharts;
