import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'antd';
import { queryPdFundChangeInfo } from '../service';
import { tableEmptyCellRender } from '@/utils/utils';

const TabTable = (props: any) => {
  const [columns] = useState(tableEmptyCellRender(props?.columns || []));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageSize: 5,
    current: 1,
    showQuickJumper: true,
    total: 0,
    showSizeChanger: false,
  });

  const fetchData = useCallback(async (params) => {
    setLoading(true);
    const { data: result } = await queryPdFundChangeInfo({
      ...params,
    });
    const { dataList, pageNum, total } = result || {};
    setData(dataList);
    setPagination({
      ...pagination,
      current: pageNum,
      total,
    });
    setLoading(false);
  }, []);

  const handleTableChange = (p: any) => {
    fetchData({
      fundState: props.fundState,
      pageNo: p.current,
      pageSize: p.pageSize,
    });
  };

  useEffect(() => {
    fetchData({
      fundState: props.fundState,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  return (
    <Table
      columns={columns}
      pagination={pagination}
      scroll={{ x: 'max-content' }}
      size="small"
      loading={loading}
      dataSource={data}
      onChange={handleTableChange}
      style={{ height: '300px' }}
    />
  );
};

export default TabTable;
