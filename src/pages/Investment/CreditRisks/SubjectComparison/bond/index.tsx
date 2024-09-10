import { totalCount } from '@/utils/utils';
import { Button, Col, Modal, Row } from 'antd';
import { find as _find, map as _map } from 'lodash';
import React, { useEffect, useState } from 'react';
import '../../index.less';
import TabTable from '../../TabTable';
import { queryBondList } from '../../service';
// import { queryFundCompanyPKListByCompCodes } from '../service';

const columns = [
  {
    label: '发行债券',
    key: 'compProvince',
  },
];

const tabColumns = [
  {
    title: '债券名称',
    key: 'bondAbbrName',
    width: 90,
    ellipsis: true,
    dataIndex: 'bondAbbrName',
  },
  {
    title: '证券类别',
    key: 'bondClassTypeName',
    dataIndex: 'bondClassTypeName',
  },
];

const tabColumnsAll = [
  {
    title: '债券名称',
    key: 'bondAbbrName',
    dataIndex: 'bondAbbrName',
  },
  {
    title: '证券类别',
    key: 'bondClassTypeName',
    dataIndex: 'bondClassTypeName',
  },
  {
    title: '债项评级',
    key: 'bondExRating',
    dataIndex: 'bondExRating',
  },
  {
    title: '内部评级',
    key: 'bondRating',
    dataIndex: 'bondRating',
  },
  {
    title: '是否持仓',
    key: 'hold',
    dataIndex: 'hold',
  },
];

// 债券
const Bond = ({ fundCodes, dateString }: any) => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        const result = await queryBondList({
          compIds: _map(fundCodes, 'key'),
          LDate: dateString,
        });
        setData(result || []);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes, dateString]);

  return (
    <div className="bond">
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
              const { key = '' } = _find(fundCodes, { index: j }) || {};
              const obj: any = _find(data, { id: key }) || {};
              return (
                <Col key={`pk-column-${j}`} className="pk-column">
                  {data.length && obj?.id ? (
                    <div style={{ width: 'calc(100% - 20px)', padding: '10px' }}>
                      <div
                        style={{
                          textAlign: 'right',
                          width: 'calc(100% - 20px)',
                          paddingBottom: '10px',
                        }}
                      >
                        <Button
                          size="small"
                          type="link"
                          onClick={() => {
                            setCurrent(obj.listData);
                            setVisible(true);
                          }}
                        >
                          更多
                        </Button>
                      </div>
                      <TabTable
                        columns={tabColumns}
                        bordered={true}
                        noPage={true}
                        scroll={true}
                        data={obj.listData}
                      />
                    </div>
                  ) : (
                    '-'
                  )}
                </Col>
              );
            })}
          </Row>
        );
      })}
      <Modal
        title="发行债券"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <TabTable
          columns={tabColumnsAll}
          bordered={true}
          noPage={true}
          scroll={true}
          data={current}
        />
      </Modal>
    </div>
  );
};

export default Bond;
