import { Radar } from '@ant-design/charts';
import { Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryAllFundQuotaScoreData } from '../../service';

const defaultData = [
  {
    item: '波动率',
    value: 0,
  },
  {
    item: '最大回撤',
    value: 0,
  },
  {
    item: '动量',
    value: 0,
  },
  {
    item: '趋势',
    value: 0,
  },
  {
    item: '风险',
    value: 0,
  },
];

export default function IndexRadar({ fundCodes }: any) {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  const config = useMemo(
    () => ({
      data,
      xField: 'item',
      yField: 'value',
      seriesField: 'fundName',
      style: { width: '100%', height: '400px' },
      autoFit: true,
      meta: {
        value: {
          alias: '数值',
          min: 0,
          max: 1,
          formatter: (v: any) => +Number(v).toFixed(2),
        },
      },
      legend: {
        position: 'top',
        itemHeight: 15,
      },
      xAxis: {
        tickLine: null,
      },
      yAxis: {
        label: false,
        grid: {
          alternateColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
      // 开启辅助点
      point: {
        size: 2,
      },
    }),
    [data],
  );

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryAllFundQuotaScoreData({
          fundCodes: _map(fundCodes, 'code'),
        });
        setLoading(false);
        setData(result.length ? result : defaultData);
      } else {
        setData(defaultData);
      }
    })();
  }, [fundCodes]);

  return (
    <Spin tip="加载中..." spinning={loading}>
      <Radar {...config} />
    </Spin>
  );
}
