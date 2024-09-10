import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { useRef, useEffect } from 'react';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';

const MyForm = ({ visible, type, title, initialValues, onVisibleChange, onFinish }: any) => {
  const formRef = useRef<FormInstance>();
  const [form] = Form.useForm();
  const dataSourceType = Form.useWatch('dataSourceType', form);
  useEffect(() => {
    // 确保formRef存在
    setTimeout(() => {
      formRef?.current?.setFieldsValue({
        ...initialValues,
        dataSourceType: initialValues.sourceType,
      });
    }, 100);
  }, [initialValues]);

  return (
    <ModalForm
      labelAlign="right"
      width="80%"
      form={form}
      title={title}
      formRef={formRef}
      visible={!!visible}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout={'horizontal'}
      onVisibleChange={onVisibleChange}
      onFinish={async (values: any) => {
        const params = { ...values };

        if (type === 'edit') {
          params.id = initialValues.id;
        }

        await formRef.current?.validateFields();
        const result = await onFinish(params);
        formRef.current?.resetFields();
        onVisibleChange(false);
        return result;
      }}
    >
      <ProFormSelect
        label="数据库类型"
        name="dataSourceType"
        placeholder="请选择数据库类型"
        rules={[{ required: true, message: '数据库类型必选' }]}
        options={[
          {
            label: 'Mysql',
            value: 'MYSQL',
          },
          {
            label: 'Oracle',
            value: 'ORACLE',
          },
          {
            label: 'REST-API',
            value: 'RESTAPI',
            disabled: true,
          },
        ]}
      />
      {dataSourceType === 'oracle' ||
      dataSourceType === 'mysql' ||
      dataSourceType === 'ORACLE' ||
      dataSourceType === 'MYSQL' ? (
        <>
          <ProForm.Group title="关系型数据库" />
          <ProFormText label="数据源名称" name="sourceName" />
          <ProFormText label="数据源描述" name="sourceDesc" />
          <ProFormText label="JDBC URL" name="jdbcUrl" />
          <ProFormText label="用户名" name="userName" />
          <ProFormText label="密码" name="password" />
        </>
      ) : null}
    </ModalForm>
  );
};

export default MyForm;
