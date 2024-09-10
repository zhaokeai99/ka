import { Column, G2 } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryFundNavRegff3ModelData } from '../service';
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

const NavRegff = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundNavRegff3ModelData({
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
      isGroup: true,
      style: { width: '100%', height: '98%' },
      maxColumnWidth: 60,
      legend: {
        position: 'top',
        itemHeight: 15,
      },
      tooltip: {
        formatter: ({ type, value }: any) => {
          return { name: type, value: `${value || '-'}` };
        },
      },
      yAxis: {
        title: {
          text: '三因子模型',
          style: {
            fontSize: 14,
          },
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
      <div className="pk-nav-reg-ff-container">
        {data.length ? <Column {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default NavRegff;
