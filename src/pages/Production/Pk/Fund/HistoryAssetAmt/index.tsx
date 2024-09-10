import { Line } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryHistoryFundAssetAmt } from '../service';
import './index.less';

const HistoryAssetAmt = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryHistoryFundAssetAmt({
          fundCodes: _map(fundCodes, 'code'),
          colNames: 'fund_asset_amt',
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
      xField: 'assetAmtDate',
      yField: 'fundAssetAmt',
      style: { width: '100%', height: '98%' },
      seriesField: 'fundName',
      legend: {
        position: 'top',
        itemHeight: 15,
        flipPage: false,
      },
      yAxis: {
        title: {
          text: '基金规模(亿)',
          style: {
            fontSize: 14,
          },
        },
      },
      xAxis: {
        label: {
          autoRotate: true,
          autoHide: true,
        },
      },
      appendPadding: 14,
      tooltip: {
        formatter: ({ fundName, fundAssetAmt }: any) => {
          return { name: fundName, value: `${fundAssetAmt}亿` };
        },
      },
      slider: {
        start: 0.8,
        end: 1,
      },
    }),
    [data],
  );

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div className="pk-history-asset-amt-container">
        {data.length ? <Line {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default HistoryAssetAmt;
