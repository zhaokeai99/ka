import React, { memo } from 'react';
import { Column } from '@ant-design/charts';
import { Line } from '@ant-design/charts';
import { Modal } from 'antd';

const DetailModal: React.FC<any> = memo((config) => {
  const { modalSomething, isModalVisible, onCancel } = config || {};
  const { modalConfig, modalData } = modalSomething || {};
  const changeConfig = {
    ...config,
    ...modalConfig,
    data: modalData,
    style: { height: '50vh' },
    legend: {
      flipPage: false,
    },
  };
  return (
    <Modal
      title="数据详情"
      visible={isModalVisible}
      width={'80vw'}
      onCancel={() => {
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      {config?.modalSomething?.modalType === 'line' ? (
        <Line {...changeConfig} />
      ) : (
        <Column {...changeConfig} />
      )}
    </Modal>
  );
});

export default DetailModal;
