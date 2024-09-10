import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'antd';
import { pageHotProducts, queryEvents } from '../../service';
import { tableEmptyCellRender } from '@/utils/utils';
import './index.less';

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
  const [selectData, setSelectData] = useState<any>(null);

  const fetchData = useCallback(async (params) => {
    setLoading(true);

    let datas = null;
    if (params.stage === 'CURRENT_MONTH' || params.stage === 'LAST_MONTH') {
      datas = await queryEvents({
        pageNo: params.pageNo,
        pageSize: params.pageSize,
        monthType: params.stage,
      });
    } else {
      datas = await pageHotProducts({
        ...params,
      });
    }

    const { dataList = [], pageNum = 5, total = 0 } = datas?.data || {};

    setData(dataList);
    if (dataList.length > 0) {
      setSelectData(dataList[0]);
    }
    setPagination({
      ...pagination,
      current: pageNum,
      total,
    });
    setLoading(false);
  }, []);

  const rowClassName = (record: any) => {
    return record.fundId === selectData?.fundId ? 'selected-row' : '';
  };

  const handleTableChange = (p: any) => {
    fetchData({
      stage: props.stage,
      pageNo: p.current,
      pageSize: p.pageSize,
    });
  };

  const onRow = (record: any) => {
    return {
      onClick: () => {
        setSelectData(record || null);
      },
    };
  };

  useEffect(() => {
    fetchData({
      stage: props.stage,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  useEffect(() => {
    const { callback } = props;
    if (callback && selectData) {
      callback(selectData);
    }
  }, [selectData]);

  return (
    <Table
      columns={columns}
      pagination={pagination}
      scroll={{ x: 'max-content' }}
      rowClassName={rowClassName}
      size="small"
      loading={loading}
      dataSource={data}
      onChange={handleTableChange}
      onRow={onRow}
      style={{ height: '300px' }}
    />
  );
};

export default TabTable;
