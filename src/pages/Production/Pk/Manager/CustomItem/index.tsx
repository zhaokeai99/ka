import { useEffect, useState } from 'react';
import { Col, Row, Spin } from 'antd';
import { find as _find, map as _map } from 'lodash';
import { queryTableData } from '@/pages/Production/HotFundIndex/service';
import { formatCustomItemColumn, formatCustomItemData } from '../../Components/service';
import { totalCount } from '@/utils/utils';

// 自定义对比项
const CustomItem = ({ codes, paramTags, searcherType }: any) => {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (Array.isArray(paramTags) && paramTags.length) {
      setColumns(formatCustomItemColumn(paramTags));
    }
    (async () => {
      if (codes.length) {
        setLoading(true);
        const { dataSource } = await queryTableData({
          pageSize: 5,
          pageNo: 1,
          current: 1,
          searchModel: {
            params: [],
            results: paramTags,
            codes: _map(codes, 'code'),
            searcherType,
          },
        });
        setLoading(false);
        setData(formatCustomItemData(dataSource));
      }
    })();
  }, [codes, paramTags]);

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
            const { code = '' } = _find(codes, { index: j }) || {};
            const obj = _find(data, { fundCode: code }) || {};

            return (
              <Col key={`pk-column-${j}`} className="pk-column">
                {data.length && obj[key] ? (
                  <span style={{ color: obj[`${key}_color`] || 'rgba(0,0,0,.85)' }}>
                    {obj[key]}
                  </span>
                ) : null}
              </Col>
            );
          })}
        </Row>
      ))}
    </Spin>
  );
};

export default CustomItem;
