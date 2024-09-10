import { Column } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { queryFundAssetAmt } from '../service';
import './index.less';

const colors: string[] = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#6F5EF9'];
const fundNames: string[] = [];

const AssetAmt = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundAssetAmt({
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
      yField: 'fundAssetAmt',
      style: { width: '100%', height: '98%' },
      legend: {
        position: 'top',
        itemHeight: 15,
      },
      maxColumnWidth: 40,
      color: ({ fundName }: any) => {
        const index = fundNames.indexOf(fundName);
        if (index < 0) {
          fundNames.push(fundName);
          return colors[fundNames.length - 1];
        }

        return colors[index];
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      yAxis: {
        title: {
          text: '基金规模(亿)',
          style: {
            fontSize: 14,
          },
        },
      },
      tooltip: {
        customContent: () => {
          return (
            <div className="asset-amt-tooltip-panel-table">
              {data.map(({ fundCode, fundName, fundAssetAmt }, i) => {
                return (
                  <div key={fundCode} className="asset-amt-tooltip-panel-row">
                    <div className="asset-amt-tooltip-panel-cell">
                      <div
                        className="asset-amt-tooltip-panel-icon "
                        style={{ backgroundColor: colors[i] }}
                      />
                    </div>
                    <span className="asset-amt-tooltip-panel-cell">{fundName}:</span>
                    <span className="asset-amt-tooltip-panel-cell">
                      {fundAssetAmt >= 0 ? fundAssetAmt : '-'}亿
                    </span>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    }),
    [data],
  );

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div className="pk-asset-amt-container">
        {data.length ? <Column {...config} /> : <Empty />}
      </div>
    </Spin>
  );
};

export default AssetAmt;
