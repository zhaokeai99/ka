import React, { useMemo, memo } from 'react';
import { Bar } from '@ant-design/charts';

const BarChart = (props: any) => {
  const config: any = useMemo(
    () => ({
      xField: 'value',
      yField: 'name',
      seriesField: 'name',
      appendPadding: 10,
      maxBarWidth: 25,
      tooltip: {
        title: false,
        formatter: (v: any) => {
          return { name: v.name, value: `${v.value}%` };
        },
      },
      xAxis: {
        grid: null,
        label: null,
        max: 100,
      },
      label: {
        position: 'right',
        offset: 2,
        content: (v: any) => {
          return `${v.value}%`;
        },
      },
      style: {
        width: '100%',
        height: props.height || '300px',
      },
    }),
    [props.data],
  );

  return <Bar {...config} data={props.data || []} />;
};

export default memo(BarChart);
