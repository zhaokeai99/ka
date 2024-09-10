import { totalCount } from '@/utils/utils';
import { Col, Row, Spin } from 'antd';
import { find as _find, get as _get, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
import '../index.less';
import { queryFundVernacularArticle } from '../service';

const columns = [
  {
    label: '白话文特征',
    key: 'fundPkNetVernacularArticleChildResult',
    children: [
      {
        label: '基本信息维度',
        key: 'baseInfo',
      },
      {
        label: '风险指标排名相关',
        key: 'riskRanking',
      },
      {
        label: '管理人维度',
        key: 'manageCompany',
      },
      {
        label: '基金经理维度',
        key: 'fundManager',
      },
    ],
  },
  {
    label: '募集期',
    key: 'raiseDate',
  },
  {
    label: '成立日',
    key: 'contractDate',
  },
  {
    label: '基金标签',
    key: 'fundTags',
  },
  {
    label: '托管费率',
    key: 'custodianRate',
  },
  {
    label: '管理费率',
    key: 'managerRate',
  },
];

// 基金白话文
const VernacularArticle = ({ fundCodes }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundVernacularArticle({
          fundCodes: _map(fundCodes, 'code'),
        });
        setData(result || []);
        setLoading(false);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes]);

  return (
    <Spin tip="加载中..." spinning={loading}>
      {columns.map(({ label, key, children }, i) => (
        <Row
          key={key}
          style={{ minHeight: '52px' }}
          className={i === 0 ? 'pk-column-title-first' : ''}
          wrap={true}
        >
          <Col className="pk-column-title">{label}</Col>
          {children ? (
            <Col className="pk-column-col">
              {(children || []).map(({ key: k, label: l }) => (
                <Row key={k} style={{ width: '100%' }}>
                  {totalCount.map((j) => {
                    const { code = '' } = _find(fundCodes, { index: j }) || {};
                    const obj = _find(data, { fundCode: code }) || {};

                    return (
                      <Col key={`pk-column-${i}-${j}`} className="pk-column-col-inner">
                        <p className="pk-column-col-inner-border">{l}</p>
                        <p className="pk-column-col-inner-text">
                          {_get(obj, `[${key}][${k}]`, '-')}
                        </p>
                      </Col>
                    );
                  })}
                </Row>
              ))}
            </Col>
          ) : (
            totalCount.map((j) => {
              const { code = '' } = _find(fundCodes, { index: j }) || {};
              const obj = _find(data, { fundCode: code }) || {};

              return (
                <Col
                  key={`pk-column-${j}`}
                  className="pk-column"
                  style={{ justifyContent: 'center' }}
                >
                  {data.length && obj[key] ? obj[key] : null}
                </Col>
              );
            })
          )}
        </Row>
      ))}
    </Spin>
  );
};

export default VernacularArticle;
