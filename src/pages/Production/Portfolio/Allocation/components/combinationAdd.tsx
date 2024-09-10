import React, { memo, useCallback, useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Select } from 'antd';
import { queryFundManager } from '../service';
const { Option } = Select;
interface PropsType {
  visible: boolean;
  handleAdd: any;
  handleEdit: any;
  handleCancel: any;
  editObj: any;
  isEdit: boolean;
}
const CombinationAdd: React.FC<PropsType> = (props) => {
  const { visible, handleAdd, handleEdit, handleCancel, isEdit, editObj } = props;
  const [form] = Form.useForm();
  const [selectList, setSelectList] = useState<any[]>([]);
  const getSelectList = useCallback(async () => {
    const { data } = await queryFundManager();
    setSelectList(Array.isArray(data) ? data : []);
  }, []);
  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        composeName: editObj.composeName,
        fundManagers: editObj.fundManagerNo.split(','),
      });
    }
  }, [isEdit, editObj]);
  useEffect(() => {
    getSelectList();
  }, []);
  // 添加/修改 组合信息提交
  const handleFinish = useCallback(
    (values: any) => {
      if (isEdit) {
        handleEdit({ ...values, fundManagers: values.fundManagers.toString() });
      } else {
        handleAdd({ ...values, fundManagers: values.fundManagers.toString() });
      }
      form.resetFields();
    },
    [handleAdd, handleEdit, isEdit],
  );
  // 取消添加/修改 关闭弹框
  const onCancel = useCallback(() => {
    handleCancel();
    form.resetFields();
  }, [handleCancel]);
  return (
    <Modal
      title={isEdit ? '修改组合信息' : '添加组合信息'}
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
          label="组合名称"
          name="composeName"
          rules={[{ required: true, message: '请输入组合名称!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="基金经理"
          name="fundManagers"
          rules={[{ required: true, message: '请输入基金经理!' }]}
        >
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="请选择基金经理">
            {selectList.map((item: any) => {
              return <Option value={item.userNo}>{item.userName}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button style={{ width: 100, marginTop: 20 }} type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(CombinationAdd);
