import { totalCount } from '@/utils/utils';
import { Col, Row } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
// import '../index.less';
import { queryFundCompanyPKListByCompCodes } from '../service';

const columns = [
  {
    label: '最新仓位',
    key: 'newStockPosition',
    suffix: '%',
    formatter: (value: number) => value.toFixed(4),
  },
  {
    label: '个人用户占比',
    key: 'personalUserProportion',
    suffix: '%',
    formatter: (value: number) => value.toFixed(4),
  },
  {
    label: '机构用户占比',
    key: 'institutionUserProportion',
    suffix: '%',
    formatter: (value: number) => value.toFixed(4),
  },
];

// 业务分析
const BusinessAnalysis = ({ fundCodes }: any) => {
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
      {columns.map((item: any, i) => {
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
                  {data.length && obj[item.key] ? item.formatter(obj[item.key]) : '-'}
                  {item.suffix || ''}
                </Col>
              );
            })}
          </Row>
        );
      })}
    </>
  );
};

export default BusinessAnalysis;
