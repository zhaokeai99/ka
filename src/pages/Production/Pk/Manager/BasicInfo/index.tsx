import React, { useEffect, useState } from 'react';
import { Col, Row, Spin } from 'antd';
import '../index.less';
import { totalCount } from '@/utils/utils';
import { find as _find, map as _map } from 'lodash';
import { fundManagerPK } from '../service';

// 基本信息
type PropsType = {
  codes: any;
};

const columns = [
  {
    label: '性别',
    key: 'sex',
  },
  {
    label: '学历',
    key: 'educationLevel',
  },
  {
    label: '专业',
    key: 'major',
  },
];

const BasicInfo = (props: PropsType) => {
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
      {columns.map(({ label, key }, i) => (
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
                {data.length && obj[key] ? obj[key] : null}
              </Col>
            );
          })}
        </Row>
      ))}
    </Spin>
  );
};

BasicInfo.isProCard = true;

export default BasicInfo;
