import { totalCount } from '@/utils/utils';
import { Col, Row, Spin } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
import '../index.less';
import { queryAllMarketFundInfos } from '../service';

const columns = [
  {
    label: '夏普比',
    key: 'year1Sharpratio',
  },
  {
    label: '卡码比',
    key: 'year1Calmarratio',
  },
  {
    label: '信息比',
    key: 'year1Inforatio',
  },
  {
    label: '波动率',
    key: 'year1AnnualVolatility',
  },
];

// 比率信息
const MarketFundInfo = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryAllMarketFundInfos({
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
      {columns.map(({ label, key }, i) => (
        <Row
          key={key}
          style={{ minHeight: '40px' }}
          className={i === 0 ? 'pk-column-title-first' : ''}
          wrap={true}
        >
          <Col className="pk-column-title">{label}</Col>
          {totalCount.map((j) => {
            const { code = '' } = _find(fundCodes, { index: j }) || {};
            const obj = _find(data, { fundCode: code }) || {};

            return (
              <Col key={`pk-column-${j}`} className="pk-column">
                {data.length && obj[key] ? obj[key] : null}
              </Col>
            );
          })}
        </Row>
      ))}
    </Spin>
  );
};

export default MarketFundInfo;
