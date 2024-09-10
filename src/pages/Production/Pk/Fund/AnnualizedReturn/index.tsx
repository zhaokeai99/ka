import { Column } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryFundPkAnnualizedReturn } from '../service';
import './index.less';

const AnnualizedReturn = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const config: any = useMemo(
    () => ({
      data,
      isGroup: true,
      xField: 'yearType',
      yField: 'value',
      seriesField: 'fundName',
      maxColumnWidth: 40,
      style: { width: '100%', height: '98%' },
      legend: {
        position: 'top',
        itemHeight: 15,
        flipPage: false,
      },
      yAxis: {
        title: {
          text: '年化回报率',
          style: {
            fontSize: 14,
          },
        },
        label: {
          formatter: (text: number) => `${text}%`,
        },
      },
      tooltip: {
        formatter: ({ fundName, value }: any) => {
          return { name: fundName, value: `${value || 0}%` };
        },
      },
    }),
    [data],
  );

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundPkAnnualizedReturn({
          fundCodes: _map(fundCodes, 'code'),
        });
        setLoading(false);
        setData(result || []);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes]);

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div className="pk-annualized-return-container">
        {data.length ? <Column {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default AnnualizedReturn;
