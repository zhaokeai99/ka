import React, { useRef } from 'react';
import { Form, message, Col } from 'antd';
import './index.less';
import { shareSolution, searchUserInfo } from '../../service';
import DebounceSelect from '@/components/DebounceSelect';
import { ModalForm, ProFormInstance } from '@ant-design/pro-form';

export type ModalProps = {
  visible: Boolean;
  searcherType: String;
  setVisible: () => {};
  scheme: { value: string; label: string };
};

const ShareModal: React.FC<ModalProps> = ({ visible, setVisible, searcherType, scheme }) => {
  const formRef = useRef<ProFormInstance>();

  const closeModal = () => {
    formRef?.current?.resetFields();
    setVisible(false);
  };
  // 方案分享
  const handleOk = async (values) => {
    const res = await shareSolution({
      ...values,
      searcherType,
      id: scheme?.value,
    });
    if (res) {
      message.success('分享成功');
      closeModal();
    } else {
      message.error('分享失败');
    }
  };

  return (
    <ModalForm
      title={'方案分享'}
      formRef={formRef}
      grid
      visible={visible}
      onFinish={handleOk}
      modalProps={{
        onCancel: () => {
          closeModal();
        },
        maskClosable: false,
      }}
    >
      <Col span={24} style={{ marginBottom: '-12px', marginLeft: '10px' }}>
        <Form.Item
          label="指定分享人员"
          name="shareUsers"
          rules={[{ required: true, message: '请选择您需要分享的人员' }]}
          extra={`请选择要将查询分案“${scheme?.label}”分享的人员`}
        >
          <DebounceSelect
            mode="multiple"
            style={{ width: '100%' }}
            labelInValue={false}
            showSearch
            allowClear
            placeholder="请选择，支持模糊搜索"
            fetchOptions={async (keyword: any) => searchUserInfo({ keyword })}
          />
        </Form.Item>
      </Col>
    </ModalForm>
  );
};

export default ShareModal;
