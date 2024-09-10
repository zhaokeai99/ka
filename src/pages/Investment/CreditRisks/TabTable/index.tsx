import React, { useState } from 'react';
import { Table } from 'antd';
// import { listManageProduct } from '../service';
import { tableEmptyCellRender } from '@/utils/utils';
import './index.less';

const TabTable = (props: any) => {
  const { data } = props;
  const [columns] = useState(tableEmptyCellRender(props?.columns || []));
  const [bordered] = useState(!!props?.bordered);
  const [page] = useState(props?.noPage);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    showQuickJumper: true,
    total: 0,
    showSizeChanger: false,
  });

  const handleTableChange = (p: any) => {
    setPagination({
      ...pagination,
      current: p.current,
      total: 0,
    });
  };

  return (
    <div className={!data?.length ? 'notHover table' : 'table'}>
      <Table
        columns={columns}
        scroll={props?.scroll ? { x: 'max-content', y: 300 } : { x: 'max-content' }}
        size="small"
        bordered={bordered}
        pagination={page ? !page : pagination}
        onChange={handleTableChange}
        dataSource={data}
      />
    </div>
  );
};

export default TabTable;
