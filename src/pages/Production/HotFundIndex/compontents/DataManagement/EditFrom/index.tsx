import React, { useEffect } from 'react';
import { Button, Form, Input, Space, Switch } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const RightEdit = ({ defaultData, handleOk, tab }: any) => {
  const [form] = Form.useForm();

  // 初始值
  useEffect(() => {
    form?.setFieldsValue(defaultData);
  }, [form, defaultData]);

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      initialValues={defaultData}
      autoComplete="off"
    >
      <Form.Item
        label={tab === 'COLUMN' ? '列项名称' : '筛选项名称'}
        name="colDesc"
        rules={[{ required: true, message: '名称不能为空!' }]}
      >
        <Input placeholder="请输入名称" />
      </Form.Item>
      <Form.Item
        label={tab === 'COLUMN' ? '列项说明' : '筛选项名称'}
        name="desc"
        rules={[{ required: true, message: '说明不能为空!' }]}
      >
        <TextArea rows={4} placeholder="请输入说明" />
      </Form.Item>
      <Form.Item label="禁止编辑" name="disabled" valuePropName="checked">
        <Switch checkedChildren="YES" unCheckedChildren="NO" />
      </Form.Item>
      <Form.Item label="默认选中" name="isChecked" valuePropName="checked">
        <Switch checkedChildren="YES" unCheckedChildren="NO" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Space size="large">
          <Button
            type="primary"
            onClick={async () => {
              const value = await form.validateFields();
              if (value) {
                handleOk(value);
              }
            }}
            htmlType="submit"
          >
            保存
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default RightEdit;
