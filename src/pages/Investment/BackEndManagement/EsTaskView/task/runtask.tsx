import React, { memo } from 'react';
import { Form, FormInstance, Input } from 'antd';

interface ModalProps {
  formValue: any;
  form: FormInstance;
}

const CatInfo = (props: ModalProps) => {
  const { formValue, form } = props;

  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={formValue}
      >
        <Form.Item name="id" hidden={true}>
          <Input type={'hidden'} />
        </Form.Item>
        <Form.Item name="publishId" hidden={true}>
          <Input type={'hidden'} />
        </Form.Item>
        <Form.Item label="任务名称" name="taskName">
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item label="任务描述" name="taskDesc">
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item label="索引名称" name="indexName">
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item label="索引描述" name="indexDesc">
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item label="增量记录列名" name="syncColumn">
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item label="增量码表名称" name="syncConfigName">
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item
          label="执行参数"
          name="runParam"
          rules={[{ required: false, message: '请输入执行参数!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};
export default memo(CatInfo);
