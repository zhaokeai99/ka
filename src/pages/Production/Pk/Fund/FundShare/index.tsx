import { Column, G2 } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryFundHoldSharesPercent } from '../service';
import './index.less';

G2.registerInteraction('element-link', {
  start: [
    {
      trigger: 'interval:mouseenter',
      action: 'element-link-by-color:link',
    },
  ],
  end: [
    {
      trigger: 'interval:mouseleave',
      action: 'element-link-by-color:unlink',
    },
  ],
});

const FundShare = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundHoldSharesPercent({
          fundCodes: _map(fundCodes, 'code'),
        });
        setLoading(false);
        setData(result || []);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes]);

  const config: any = useMemo(
    () => ({
      data,
      xField: 'fundName',
      yField: 'value',
      seriesField: 'type',
      isPercent: true,
      legend: {
        position: 'top',
        itemHeight: 15,
      },
      isStack: true,
      style: { width: '100%', height: '98%' },
      maxColumnWidth: 60,
      yAxis: {
        title: {
          text: '持仓分析',
          style: {
            fontSize: 14,
          },
        },
        label: {
          formatter: (text: number) => `${(text * 100).toFixed(0)}%`,
        },
      },
      label: {
        position: 'middle',
        content: (item) => {
          if (item.value < 0.1) return '';
          return `${(item.value * 100).toFixed(2)}%`;
        },
        style: {
          fill: '#fff',
        },
      },
      interactions: [
        {
          type: 'element-highlight-by-color',
        },
        {
          type: 'element-link',
        },
      ],
    }),
    [data],
  );

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div className="pk-fund-share-container">
        {data.length ? <Column {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default FundShare;
