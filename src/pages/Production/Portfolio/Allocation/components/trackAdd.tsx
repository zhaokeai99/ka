import React, { memo, useCallback } from 'react';
import { Modal, Button, Input, Form } from 'antd';
interface PropsType {
  visible: boolean;
  handleOk: any;
  handleCancel: any;
}
const TrackAdd: React.FC<PropsType> = (props) => {
  const { visible, handleOk, handleCancel } = props;
  const [form] = Form.useForm();
  const handleFinish = useCallback(
    (values: any) => {
      handleOk(values);
      form.resetFields();
    },
    [handleOk],
  );
  const onCancel = useCallback(() => {
    handleCancel();
    form.resetFields();
  }, [handleCancel]);
  return (
    <Modal
      title="添加赛道"
      visible={visible}
      onCancel={onCancel}
      centered
      width={500}
      footer={false}
    >
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          label="赛道名称"
          name="trackName"
          rules={[{ required: true, message: '请输入组合名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button style={{ width: 100 }} type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(TrackAdd);
