import React from 'react';
import { Modal } from 'antd';
import Panels from './Panels';
import Datas from './Data';
import styles from './index.less';

const VersionGuide: React.FC<any> = (props: any) => {
  const { isModalVisible, hideModal } = props || {};

  return (
    <Modal
      className={styles['panels-out']}
      maskClosable={false}
      closable={false}
      visible={isModalVisible}
      footer={null}
      width={600}
      //   onCancel={() => {
      //     if (hideModal) {
      //       hideModal();
      //     }
      //   }}
    >
      <Panels datas={Datas} finishAction={hideModal} />
    </Modal>
  );
};

export default VersionGuide;
