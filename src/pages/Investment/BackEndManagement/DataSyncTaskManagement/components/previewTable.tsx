import { Table } from 'antd';
import React, { memo } from 'react';
import './../index.css';

interface ModalProps {
  data: any;
  columns: any;
}

const IndexInfo = (props: ModalProps) => {
  const { data, columns } = props;

  return (
    <>
      <div style={{ width: '100%', overflowY: 'auto' }}>
        <Table columns={columns} dataSource={data} size={'small'} pagination={false} />
      </div>
    </>
  );
};
export default memo(IndexInfo);
