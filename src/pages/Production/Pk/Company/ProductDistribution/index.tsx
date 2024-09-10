import { totalCount } from '@/utils/utils';
import { Col, Row } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
// import '../index.less';
import { queryFundCompanyPKListByCompCodes } from '../service';

const columns = [
  {
    label: '主动权益',
    key: 'activeEquityAMTDesc',
  },
  {
    label: '被动权益',
    key: 'unActiveEquityAMTDesc',
  },
  {
    label: '固收+',
    key: 'fixedIncomePlusAMTDesc',
  },
  {
    label: '固收',
    key: 'fixedIncomeAMTDesc',
  },
  {
    label: 'FOF',
    key: 'fofAMTDesc',
  },
  {
    label: '其他',
    key: 'otherAMTDesc',
  },
  {
    label: '总计',
    key: 'amtTotalDesc',
  },
];

// 产品分布
const ProductDistribution = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        const result = await queryFundCompanyPKListByCompCodes({
          codes: _map(fundCodes, 'code'),
        });
        setData(result || []);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes]);

  return (
    <>
      {columns.map((item, i) => {
        return (
          <Row
            key={item.key}
            style={{ minHeight: '40px' }}
            wrap={true}
            className={i === 0 ? 'pk-column-title-first' : ''}
          >
            <Col className="pk-column-title">{item.label}</Col>
            {totalCount.map((j) => {
              const { code = '' } = _find(fundCodes, { index: j }) || {};
              const obj = _find(data, { fundCompCode: code }) || {};
              return (
                <Col key={`pk-column-${j}`} className="pk-column">
                  {data.length && obj[item.key] ? obj[item.key] : '-'}
                </Col>
              );
            })}
          </Row>
        );
      })}
    </>
  );
};

export default ProductDistribution;
