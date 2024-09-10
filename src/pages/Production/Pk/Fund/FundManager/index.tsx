import ColorSpan from '@/components/ColorSpan';
import { totalCount } from '@/utils/utils';
import { Col, Row, Spin } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { useEffect, useState } from 'react';
import '../index.less';
import { queryFundManager } from '../service';

const columns = [
  {
    label: '姓名',
    key: 'name',
  },
  {
    label: '管理年限',
    key: 'managedYears',
    suffix: '年',
  },
  {
    label: '在管数量',
    key: 'fundCnt',
  },
  {
    label: '管理规模',
    key: 'fundAmt',
  },
  {
    label: '获奖内容',
    key: 'awards',
  },
  {
    label: '在任收益率',
    key: 'totalIncome',
  },
];

// 基金经理
const FundManager = ({ fundCodes }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        setLoading(true);
        const result = await queryFundManager({
          fundCodes: _map(fundCodes, 'code'),
        });
        setLoading(false);
        setData(result || []);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes]);

  const columnsRender = (list: any, key: any) =>
    list.length &&
    list.map((item: any, index: number) => {
      const lastItem = index + 1 === list.length;
      let res;
      switch (key) {
        case 'name':
          res = item[key] ? (
            <span key={index}>
              <a href={`#/production/fundManager/${item?.code}`}>{item[key]}</a>
              {!lastItem ? ' & ' : ''}
            </span>
          ) : (
            '-'
          );
          break;
        case 'awards':
          res = item[key] ? (
            <div key={index}>
              {item[key]}
              {!lastItem ? ' | ' : ''}
            </div>
          ) : (
            '-'
          );
          break;
        case 'totalIncome':
          res = (
            <>
              {item[key] ? <ColorSpan value={parseFloat(item[key])} suffix="%" /> : '-'}
              {!lastItem ? ' | ' : ''}
            </>
          );
          break;
        default:
          res = lastItem ? item[key] : `${item[key]} | `;
          break;
      }

      return res || '-';
    });

  return (
    <Spin tip="加载中..." spinning={loading}>
      {columns.map(({ label, key }, i) => (
        <Row
          key={key}
          style={{ minHeight: '40px' }}
          wrap={true}
          className={i === 0 ? 'pk-column-title-first' : ''}
        >
          <Col className="pk-column-title">{label}</Col>
          {totalCount.map((j) => {
            const { code = '' } = _find(fundCodes, { index: j }) || {};
            const { managerList = [] } = _find(data, { fundCode: code }) || {};

            return (
              <Col key={`pk-column-${j}`} className="pk-column">
                <div>{columnsRender(managerList, key) || '-'}</div>
              </Col>
            );
          })}
        </Row>
      ))}
    </Spin>
  );
};

export default FundManager;
