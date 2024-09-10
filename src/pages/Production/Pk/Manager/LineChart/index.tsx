import React, { memo, useMemo } from 'react';
import { Line } from '@ant-design/charts';
import { numberToT } from '@/utils/utils';

interface LineChartProps {
  data: any;
  type: string;
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const { data, type } = props;

  const config: any = useMemo(
    () => ({
      data,
      appendpadding: 15,
      style: {
        height: '100%',
        width: '100%',
      },
      xField: 'valueDate',
      yField: 'value',
      seriesField: 'code',
      xAxis: {
        label: {
          autoRotate: true,
          autoHide: true,
        },
      },
      meta: {
        code: {
          formatter: (text: string) => {
            const nameArr = data?.filter((d: any) => text === d.code);
            return nameArr[0]?.name || text;
          },
        },
        value: {
          formatter: (text: string) => {
            return type === 'AMT' ? numberToT(text) : `${text}%`;
          },
        },
      },
      legend: {
        position: 'top',
      },
      slider: {
        start: 0.8,
        end: 1,
      },
    }),
    [data, type],
  );

  return <Line {...config} />;
};

export default memo(LineChart);
