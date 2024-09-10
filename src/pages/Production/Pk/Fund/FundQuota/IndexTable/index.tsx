import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getFundQuotaDescribeList } from '../../service';

const columns = [
  {
    width: '120px',
    title: '维度',
    dataIndex: 'quota',
    key: 'quota',
  },
  {
    title: '描述',
    dataIndex: 'content',
    key: 'content',
  },
];

const IndexTable = function () {
  const [descList, setDescList] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const data = await getFundQuotaDescribeList();

      setDescList(data);
    })();
  }, []);

  return <Table bordered size="small" dataSource={descList} columns={columns} pagination={false} />;
};

export default IndexTable;
