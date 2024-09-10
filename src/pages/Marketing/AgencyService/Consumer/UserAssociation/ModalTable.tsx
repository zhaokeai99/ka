import React, { memo } from 'react';
import { Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './service';

const clumns = [
  {
    title: '机构用户ID',
    width: 110,
    dataIndex: 'userId',
    hideInSearch: true,
  },
  {
    title: '机构用户名',
    width: 100,
    ellipsis: true,
    dataIndex: 'userName',
    hideInSearch: true,
  },
  {
    title: '机构用户手机号',
    width: 100,
    ellipsis: true,
    dataIndex: 'mobile',
    hideInSearch: true,
  },
];

interface ModalProps {
  visible: boolean;
  title: string;
  dataList: any[];
  onClose: (val?: string) => void;
}

const ModalTable = (props: ModalProps) => {
  const { visible, title, dataList } = props;

  return (
    <Modal
      title={`${title}-当前关联用户`}
      visible={visible}
      onCancel={() => props.onClose()}
      footer={null}
      bodyStyle={{ padding: 0 }}
    >
      <ProTable<TableListItem>
        dataSource={dataList}
        size="small"
        rowKey="userId"
        columns={clumns}
        search={false}
        pagination={false}
        options={false}
      />
    </Modal>
  );
};

export default memo(ModalTable);
