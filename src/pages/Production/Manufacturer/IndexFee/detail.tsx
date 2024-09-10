import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'antd';
import { tableEmptyCellRender } from '@/utils/utils';
import { queryDetail } from './service';

const columns = [
  {
    title: '产品代码',
    dataIndex: 'fundCode',
    key: 'fundCode',
  },
  {
    title: '净值日期',
    dataIndex: 'netWorthDate',
    key: 'netWorthDate',
  },
  {
    title: '资产净值',
    dataIndex: 'nav',
    key: 'nav',
  },
  {
    title: '计提日应付费',
    dataIndex: 'accualPayable',
    key: 'accualPayable',
  },
  {
    title: '最低日应付费',
    dataIndex: 'minPayable',
    key: 'minPayable',
  },
  {
    title: '实际日应付费',
    dataIndex: 'realPayable',
    key: 'realPayable',
  },
];

const Detail: React.FC<{
  fundCode: any;
  businessCycle: string;
  showDetail: boolean;
}> = ({ fundCode, businessCycle, showDetail }) => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [data, setData] = useState<any>([]);
  const [totalNum, setTotalNum] = useState('-');

  const fetchData = async (p: any) => {
    const { data: dataInfo, success } = await queryDetail({
      fundCode: p.fundCode,
      businessCycle: p.businessCycle,
      pageNo: p.current,
      pageSize: p.pageSize,
    });

    const { dataList, total, pageNum, map } = dataInfo || {};
    setTotalNum(map?.sumDetailCharge || '--');
    setData(dataList || []);
    if (success) {
      setPagination((params) => ({
        ...params,
        total,
        current: pageNum,
      }));
    }
  };

  useEffect(() => {
    if (fundCode) {
      fetchData({
        fundCode,
        businessCycle,
        ...pagination,
      });
    }
  }, [fundCode, businessCycle, showDetail]);

  const handleTableChange = useCallback((page) => {
    fetchData({
      fundCode,
      businessCycle,
      pageNo: page.current,
      pageSize: page.pageSize,
      current: page.current,
    });
  }, []);

  return (
    <>
      {pagination.current === 1 ? <p>总计： {totalNum}</p> : null}
      <Table
        columns={tableEmptyCellRender(columns as any)}
        dataSource={data}
        pagination={pagination}
        scroll={{ y: 450 }}
        onChange={handleTableChange}
        size="small"
      />
    </>
  );
};

export default Detail;
