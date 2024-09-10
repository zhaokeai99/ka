import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { useRef, useEffect } from 'react';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-components';
// import {
//   calIndexNode
// } from './service';

const TestForm = ({ visible, initialValues, onVisibleChange, onFinish }: any) => {
  const formRef = useRef<FormInstance>();
  const [form] = Form.useForm();

  useEffect(() => {
    // 确保formRef存在
    setTimeout(() => {
      formRef?.current?.setFieldsValue({
        ...initialValues,
      });
    }, 100);
  }, [initialValues]);

  return (
    <ModalForm
      width="60%"
      form={form}
      title="测试指标任务信息"
      formRef={formRef}
      visible={!!visible}
      layout={'horizontal'}
      onVisibleChange={onVisibleChange}
      onFinish={async (values: any) => {
        const params = { ...values };
        await formRef.current?.validateFields();
        const result = await onFinish(params);
        formRef.current?.resetFields();
        return result;
      }}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 14 }}
    >
      <ProFormText label="节点名称" name="" disabled={true} />
      <ProFormText label="任务名称" name="" />
      <ProFormSelect
        label="任务类型"
        name=""
        placeholder="请选择"
        rules={[{ required: true, message: '必选' }]}
        options={[]}
      />
      <ProFormText label="超过时间" name="" />
      <ProFormText label="重试次数" name="" />
      <ProFormText label="重试间隔" name="" />
      <ProFormText label="绑定代码" name="" />
      <div style={{ display: 'none' }}>
        <ProFormText name="" />
      </div>
      <EditableProTable />
    </ModalForm>
  );
};

export default TestForm;
