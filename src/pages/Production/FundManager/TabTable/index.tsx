import React, { memo, useState, useEffect, useCallback } from 'react';
import { Table } from 'antd';
import SearchForm from '../SearchForm';
import { listManageProduct } from '../service';
import { tableEmptyCellRender } from '@/utils/utils';

const TabTable = (props: any) => {
  const initialParams = {
    keyWord: '',
    productTypeOne: '',
    thClassType: '',
  };
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
  // const [formValues, setFormValues] = useState(initialParams);
  const [initFundFlagValue, setInitFundFlagValue] = useState('是');

  const { code, type, role, rowKey } = props;
  const fetchData = useCallback(async (params) => {
    setLoading(true);
    const result = await listManageProduct({
      code,
      isCurr: type,
      ...params,
      role,
    });

    const { dataList = [], pageNum = 5, total = 0 } = result || {};
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
      pageNo: p.current,
      pageSize: p.pageSize,
      initFundFlag: initFundFlagValue,
    });
  };

  useEffect(() => {
    handleTableChange({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  return (
    <div>
      <SearchForm
        onFinish={(values: any) => {
          // setFormValues(values);
          setInitFundFlagValue(values?.initFundFlag);
          fetchData({ pageNo: 1, pageSize: 5, ...values });
        }}
        // @ts-ignore
        onReset={() => {
          // setFormValues(initialParams);
          fetchData({ ...initialParams, pageNo: 1, pageSize: 5 });
        }}
        rowKey={rowKey}
      />

      <Table
        columns={columns}
        pagination={pagination}
        scroll={{ x: 'max-content' }}
        size="small"
        loading={loading}
        onChange={handleTableChange}
        dataSource={data}
      />
    </div>
  );
};

export default memo(TabTable);
