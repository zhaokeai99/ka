import React from 'react';
import { Table, Empty } from 'antd';
import ProCardPlus from '@/components/ProCardPlus';
import { dealNumThousandsAndFloat } from '@/utils/utils';

type CombinationProps = {
  total?: string;
  dataSource: any[];
};

// 组合持仓
const CombinationCard = (props: CombinationProps) => {
  const { total, dataSource } = props;
  const columns = [
    {
      title: '组合代码',
      dataIndex: 'fundCode',
    },
    {
      title: '组合名称',
      dataIndex: 'fundName',
    },
    {
      title: '持仓数量(万)',
      dataIndex: 'hldAmount',
    },
    {
      title: '持仓市值',
      dataIndex: 'hldBalance',
      valueType: 'digit',
      render: (text: any) => dealNumThousandsAndFloat(text, 2),
    },
    {
      title: '持仓比例',
      dataIndex: 'hldRatio',
      render: (text: number) => `${(text * 100).toFixed(2)}%`,
    },
    {
      title: '持仓排序',
      dataIndex: 'hldSort',
    },
  ];

  return (
    <ProCardPlus
      title="组合持仓情况"
      extra={
        <span>
          最新持仓市值合计：
          <span style={{ color: '#D9001B', paddingLeft: '5px' }}>{total}</span>
        </span>
      }
      style={{ height: '352px' }}
      layout="center"
    >
      {dataSource.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Table
          columns={columns}
          scroll={{ x: true, y: 240 }}
          size="small"
          rowKey={(record, index) => `${record.bondCode}--${index}`}
          dataSource={dataSource}
          pagination={false}
        />
      )}
    </ProCardPlus>
  );
};

CombinationCard.isProCard = true;

export default CombinationCard;
