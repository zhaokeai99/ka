import React, { useState, useEffect, memo } from 'react';
import { Empty } from 'antd';
import { DualAxes } from '@ant-design/charts';
import moment from 'moment';
import { numberToT } from '@/utils/utils';
import { queryFundAsset, queryFundAssetPosition } from '../service';

const config = {
  data: [[], []],
  xField: 'dateView',
  style: {
    width: '98%',
    height: '100%',
  },
  yField: ['ratio', 'totalAsset'],
  yAxis: {
    ratio: {
      max: 1,
      label: {
        formatter: (v: any) => `${parseFloat((v * 100).toFixed(2))}%`,
      },
    },
    totalAsset: {
      label: {
        formatter: (v: any) => {
          return numberToT(v);
        },
      },
    },
  },
  meta: {
    totalAsset: {
      min: 0,
    },
  },
  geometryOptions: [
    { geometry: 'column', isGroup: true, seriesField: 'holdGroupName' },
    {
      geometry: 'line',
      lineStyle: { lineWidth: 2 },
    },
  ],
};

const MyDualAxes = ({ fundId, date }: any) => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
    (async () => {
      const [result1, result2] = await Promise.all([
        queryFundAssetPosition({
          fundId,
          rangeType: 'month',
          startDate: moment(date).month(-12).format('YYYY-MM-DD'),
          endDate: date,
        }),
        queryFundAsset({
          fundId,
          rangeType: 'month',
          startDate: moment(date).month(-12).format('YYYY-MM-DD'),
          endDate: date,
        }),
      ]);

      setData1(result1);
      setData2(result2);
    })();
  }, []);

  if (data1.length === 0 && data2.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <DualAxes {...config} data={[data1, data2]} />;
};

export default memo(MyDualAxes);
