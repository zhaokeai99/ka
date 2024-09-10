import { Button, Form, Input } from 'antd';
import React from 'react';

const SearchForm = ({ onFinish }: any) => {
  const [form] = Form.useForm();

  const submit = async (value: any) => {
    onFinish(value);
  };
  return (
    <Form form={form} layout="inline" onFinish={submit} style={{ marginBottom: '16px' }}>
      <Form.Item label="基金经理名字" name="fundCompName" labelAlign="left" initialValue="">
        <Input allowClear={true} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
          查询
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
          }}
        >
          重置
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchForm;
