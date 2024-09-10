import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'antd';
import { fundSurvivalProducts } from '../service';

const SurvivalTable = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: false,
  });

  const fetchData = useCallback(async (p: any) => {
    setLoading(true);
    const { success, data } = await fundSurvivalProducts({
      value: props.fundState,
      pageNo: p.current,
      pageSize: p.pageSize,
    });
    setListData(data?.dataList || []);
    if (success) {
      setPagination({
        ...pagination,
        current: data.pageNum,
        total: data.total,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData({
      fundState: props.fundState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  const tableOnChange = useCallback((params: any) => {
    fetchData(params);
  }, []);

  return (
    <Table
      columns={props?.columns || []}
      pagination={pagination}
      scroll={{ x: 'max-content' }}
      size="small"
      loading={loading}
      dataSource={listData}
      onChange={tableOnChange}
      style={{ height: '300px' }}
    />
  );
};

export default SurvivalTable;
