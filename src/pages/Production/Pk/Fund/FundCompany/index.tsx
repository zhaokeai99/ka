import { numberToT, qfw, totalCount } from '@/utils/utils';
import { Col, Row, Spin } from 'antd';
import { find as _find, map as _map } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import '../index.less';
import { queryFundCompany } from '../service';

const columns = [
  {
    label: '公司名称',
    key: 'fundCompName',
  },
  {
    label: '成立时间',
    key: 'foundDate',
    formatter: (value: string) => moment(value).format('YYYY-MM-DD'),
  },
  {
    label: '所在地区',
    key: 'compProvince',
  },
  {
    label: '总规模',
    key: 'totalPublicFundAMT',
    formatter: (value: string) => qfw(numberToT(value, 2, false, false), ''),
  },
  {
    label: '非货规模',
    key: 'totalPublicUNMFFundAMT',
    formatter: (value: string) => qfw(numberToT(value, 2, false, false), ''),
  },
];

// 管理人
const FundCompany = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundCompany({
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
      {columns.map(({ label, key, formatter = (v) => v }, i) => (
        <Row
          key={key}
          style={{ minHeight: '40px' }}
          wrap={true}
          className={i === 0 ? 'pk-column-title-first' : ''}
        >
          <Col className="pk-column-title">{label}</Col>
          {totalCount.map((j) => {
            const { code = '' } = _find(fundCodes, { index: j }) || {};
            const obj: any = _find(data, { fundCode: code }) || {};

            return (
              <Col key={`pk-column-${j}`} className="pk-column">
                {data.length && obj[key] ? (
                  key === 'fundCompName' && obj?.fundCompCode ? (
                    <a href={`#/production/fundCompany/${obj.fundCompCode}`}>
                      {formatter(obj[key])}
                    </a>
                  ) : (
                    formatter(obj[key])
                  )
                ) : (
                  '-'
                )}
              </Col>
            );
          })}
        </Row>
      ))}
    </Spin>
  );
};

export default FundCompany;
