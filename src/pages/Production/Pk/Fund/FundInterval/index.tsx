import { totalCount } from '@/utils/utils';
import { Col, Row, Spin } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
import '../index.less';
import { queryFundInterval } from '../service';

const columns = [
  {
    label: '近1月',
    key: 'mon1Rate',
  },
  {
    label: '近3月',
    key: 'mon3Rate',
  },
  {
    label: '近6月',
    key: 'mon6Rate',
  },
  {
    label: '近1年',
    key: 'year1Rate',
  },
  {
    label: '近3年',
    key: 'year3Rate',
  },
  {
    label: '近5年',
    key: 'year5Rate',
  },
];

// 区间收益及同类排名
const FundInterval = ({ fundCodes, classify }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundInterval({
          fundCodes: _map(fundCodes, 'code'),
          classify,
        });
        setLoading(false);
        setData(result || []);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes, classify]);

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

export default FundInterval;
