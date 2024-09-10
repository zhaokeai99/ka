import { Column, G2 } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryFundNavRegIndusPkData } from '../service';
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

const NavRegIndus = ({ fundCodes }: any) => {
  const [data, setData]: any[] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundNavRegIndusPkData({
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
      xField: 'fundShortName',
      yField: 'indusCoeff',
      seriesField: 'classifyOneTypeName',
      isStack: true,
      style: { width: '100%', height: '98%' },
      maxColumnWidth: 150,
      yAxis: {
        title: {
          text: '行业分析模型',
          style: {
            fontSize: 14,
          },
        },
        label: {
          formatter: (text: number) => `${text}%`,
        },
      },
      legend: {
        position: 'top',
        itemHeight: 15,
        flipPage: false,
      },
      label: {
        position: 'middle',
        content: (item: any) => {
          if (item.indusCoeff < 0.1) return '';
          return `${item.classifyOneTypeName} ${item.indusCoeff}%`;
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
      <div className="pk-nav-reg-indus-container">
        {data.length ? <Column {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default NavRegIndus;
