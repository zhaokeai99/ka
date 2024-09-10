import React, { useEffect, useState, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Space, DatePicker, Table } from 'antd';
import { queryStatisticTableList } from '../service';
import moment from 'moment';
import { tableEmptyCellRender, GUTTER_SIZE } from '@/utils/utils';

const { RangePicker } = DatePicker;

const StatisticTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<any[]>([]);
  const [tableList, setTableList] = useState([]);

  const fetchList = useCallback(
    async (date?: any) => {
      setLoading(true);
      const { header, dataList } = await queryStatisticTableList({
        startDate: date && date[0]?.format('YYYY-MM-DD'),
        endDate: date && date[1]?.format('YYYY-MM-DD'),
      });
      setLoading(false);
      setColumns(header);
      setTableList(dataList);
    },
    [columns, tableList],
  );

  useEffect(() => {
    fetchList([]);
  }, []);

  return (
    <ProCard gutter={[GUTTER_SIZE, 0]} ghost>
      <ProCardPlus
        colSpan={24}
        layout="center"
        ghost
        extra={
          <Space>
            <label>统计范围：</label>
            <RangePicker onChange={fetchList} defaultValue={[moment().startOf('year'), moment()]} />
          </Space>
        }
      >
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

export default StatisticTable;
