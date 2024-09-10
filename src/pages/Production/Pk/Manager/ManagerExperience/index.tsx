import ColorSpan from '@/components/ColorSpan';
import { totalCount } from '@/utils/utils';
import { Col, Row, Spin } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
import { fundManagerPK } from '../service';

// 管理经验
type PropsType = {
  codes: any;
};

const columns = [
  {
    label: '管理年限',
    key: 'managedYears',
  },
  {
    label: '管理数量',
    key: 'fundCnt',
  },
  {
    label: '在任收益率',
    key: 'totalIncome',
    formatter: (value: number) => <ColorSpan value={value.toFixed(4)} suffix="%" />,
  },
  {
    label: '在任最大回撤',
    key: 'totalMaxRetreatment',
    suffix: '%',
    formatter: (value: number) => value.toFixed(4),
  },
  {
    label: '获奖情况',
    key: 'awards',
  },
  {
    label: '最新仓位',
    key: 'newStockPosition',
    suffix: '%',
    formatter: (value: number) => value.toFixed(4),
  },
  {
    label: '行业偏好',
    key: 'industryPref',
  },
];

const ManagerExperience = (props: PropsType) => {
  const { codes } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (codes.length) {
        setLoading(true);
        const res = await fundManagerPK({ codes: _map(codes, 'code') });
        setLoading(false);
        setData(res);
      } else {
        setData([]);
      }
    })();
  }, [codes]);

  return (
    <Spin tip="加载中..." spinning={loading}>
      {columns.map(({ label, key, suffix = '', formatter = (v) => v }, i) => (
        <Row
          key={key}
          style={{ minHeight: '52px' }}
          className={i === 0 ? 'pk-column-title-first' : ''}
          wrap={true}
        >
          <Col className="pk-column-title">{label}</Col>
          {totalCount.map((j) => {
            const { code = '' } = _find(codes, { index: j }) || {};
            const obj = _find(data, { code }) || {};

            return (
              <Col
                key={`pk-column-${j}`}
                className="pk-column"
                style={{ justifyContent: 'center' }}
              >
                {data.length && obj[key] ? formatter(obj[key]) : '-'}
                {suffix}
              </Col>
            );
          })}
        </Row>
      ))}
    </Spin>
  );
};

export default ManagerExperience;
