import { Line } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { queryFundNavRegClModelData } from '../service';
import './index.less';

const NavRegCl = ({ fundCodes, title, yField }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundNavRegClModelData({
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
      yField,
      seriesField: 'fundShortName',
      style: { width: '100%', height: '98%' },
      legend: {
        position: 'top',
        itemHeight: 15,
        flipPage: false,
      },
      meta: {
        pTradeDate: {
          formatter: (timestamp: number) => {
            return moment(timestamp).format('YYYY-MM-DD');
          },
        },
      },
      yAxis: {
        title: {
          text: title,
          style: {
            fontSize: 14,
          },
        },
      },
      slider: {
        start: 0.8,
        end: 1,
        formatter: (timestamp: number) => {
          console.log('timestamp', timestamp);
          return moment(timestamp).format('YYYY-MM-DD');
        },
      },
    }),
    [data, title, yField],
  );

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div className="pk-nav-reg-cl-container">
        {data.length ? <Line {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default NavRegCl;
