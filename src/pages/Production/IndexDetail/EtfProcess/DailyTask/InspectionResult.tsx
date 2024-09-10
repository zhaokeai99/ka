import React, { memo } from 'react';
import { Modal, Row, Col } from 'antd';
import styles from './style.less';
import { qfw } from '@/utils/utils';
// 检查结果集
interface propsType {
  record: any;
  visible: boolean;
  handleOnCancel: () => void;
}
const FileContentDiff = (props: propsType) => {
  const { record } = props;
  return (
    <Modal
      title={'检查结果集'}
      centered
      visible={props.visible}
      width={500}
      footer={false}
      onCancel={props.handleOnCancel}
    >
      {Object.keys(record).map((item: any, index: number) => {
        return (
          <Row key={index}>
            <Col span={12}>
              <div className={styles['result-label']}>{item}</div>
            </Col>
            <Col span={12}>
              <div className={styles['result-value']}>
                {index === 1 || index === 2 ? qfw(record[item], '') : record[item]}
              </div>
            </Col>
          </Row>
        );
      })}
    </Modal>
  );
};
export default memo(FileContentDiff);
