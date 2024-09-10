import { Area } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { queryFundNavRegStockPosPkData } from '../service';
import './index.less';

const NavRegStockPos = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundNavRegStockPosPkData({
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
      xField: 'pTradeDate',
      yField: 'fundStockPos',
      seriesField: 'fundShortName',
      style: { width: '100%', height: '98%' },
      legend: {
        position: 'top',
        itemHeight: 15,
      },
      yAxis: {
        title: {
          text: '基金仓位',
          style: {
            fontSize: 14,
          },
        },
        label: {
          formatter: (text: number) => `${text}%`,
        },
      },
      meta: {
        pTradeDate: {
          formatter: (timestamp: number) => {
            return moment(timestamp).format('YYYY-MM-DD');
          },
        },
      },
      slider: {
        start: 0.8,
        end: 1,
        formatter: (timestamp: number) => {
          return moment(timestamp).format('YYYY-MM-DD');
        },
      },
    }),
    [data],
  );

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div className="pk-nav-reg-stock-container">
        {data.length ? <Area {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default NavRegStockPos;
