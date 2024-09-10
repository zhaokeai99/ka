import { Modal, Tabs } from 'antd';
import React, { useState } from 'react';
import FilterItems from './FilterItems';

interface DataManagementProps {
  type: string;
  isModalOpen: boolean;
  handleClose: (params: any) => void;
}

const DataManagementModal = ({ isModalOpen, handleClose, type }: DataManagementProps) => {
  const [isChanged, setIsChange] = useState(false);

  return (
    <Modal
      centered
      visible={isModalOpen}
      footer={false}
      onCancel={() => {
        handleClose(isChanged);
        setIsChange(false);
      }}
      bodyStyle={{ padding: '0 24px' }}
      width={1000}
      destroyOnClose={true}
    >
      <Tabs defaultActiveKey="COLUMN">
        <Tabs.TabPane tab="列项" key="COLUMN">
          <FilterItems type={type} tab="COLUMN" handleChange={() => setIsChange(true)} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="筛选项" key="FILTER">
          <FilterItems type={type} tab="FILTER" handleChange={() => setIsChange(true)} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default DataManagementModal;
