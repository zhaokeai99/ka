import { totalCount } from '@/utils/utils';
import { Col, Row } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
// import '../index.less';
import { queryFundCompanyPKListByCompCodes } from '../service';

const columns = [
  {
    label: '所在地区',
    key: 'compProvince',
  },
  {
    label: '总产品数',
    key: 'totalFundCNT',
  },
  {
    label: '成立时间',
    key: 'foundDate',
  },
  {
    label: '基金经理数',
    key: 'fundManagerCNT',
  },
  {
    label: '获奖情况',
    key: 'awards',
  },
];

// 基金经理
const BasicInfo = ({ fundCodes }: any) => {
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
                  {/* {suffix} */}
                </Col>
              );
            })}
          </Row>
        );
      })}
    </>
  );
};

export default BasicInfo;
