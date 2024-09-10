import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Table } from 'antd';
import { queryMutualFundApproveInfoList } from '../service';
import { tableEmptyCellRender, GUTTER_SIZE } from '@/utils/utils';

const columns: any = [
  {
    title: '产品类型一',
    dataIndex: 'fundType',
    key: 'fundType',
  },
  {
    title: '产品类型二',
    dataIndex: 'fundTypeTwo',
    key: 'fundTypeTwo',
  },
  {
    title: '上报数量',
    dataIndex: 'reportNum',
    key: 'reportNum',
  },
  {
    title: '获批数量',
    dataIndex: 'approveNum',
    key: 'approveNum',
  },
  {
    title: '审批周期（天）',
    dataIndex: 'approveDay',
    key: 'approveDay',
  },
  {
    title: '审批周期（近三个月）',
    dataIndex: 'approveDayLatestQuarter',
    key: 'approveDayLatestQuarter',
  },
];

const ApproveSpeedTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tableList, setTableList] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await queryMutualFundApproveInfoList();
      setTableList(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <ProCard gutter={[GUTTER_SIZE, 0]} ghost>
      <ProCardPlus colSpan={24} layout="center" ghost>
        <Table
          style={{ width: '100%' }}
          rowKey={columns[0]?.key}
          loading={loading}
          columns={tableEmptyCellRender(columns)}
          pagination={false}
          dataSource={tableList}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </ProCardPlus>
    </ProCard>
  );
};

export default ApproveSpeedTable;
