import type { FormInstance, ModalProps } from 'antd';
import type { FormProps } from '../data';
import { useEffect, useRef } from 'react';
import { ModalForm, ProFormText, ProFormRadio, ProFormDigit } from '@ant-design/pro-form';

const AppForm: React.FC<FormProps & ModalProps> = ({
  visible,
  title,
  type,
  initialValues = {},
  submitter = true,
  onVisibleChange,
  onFinish,
}) => {
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    // 确保formRef存在
    formRef?.current?.setFieldsValue({
      ...initialValues,
      checkSign: initialValues.checkSign ? 'YES' : 'NO',
      retryable: initialValues.retryable ? 'YES' : 'NO',
    });
  }, []);

  return (
    <ModalForm
      title={title}
      formRef={formRef}
      visible={!!visible}
      layout="horizontal"
      submitter={submitter}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      onVisibleChange={onVisibleChange}
      onFinish={async (values) => {
        const params = { ...values };
        if (type === 'edit') {
          params.id = initialValues?.id;
        }
        let result;
        await formRef.current?.validateFields();
        if (onFinish) {
          result = await onFinish(params);
        }
        formRef.current?.resetFields();
        return result;
      }}
    >
      <ProFormText
        rules={[{ required: true, message: '必填的项' }]}
        label="应用系统名"
        name="appName"
        disabled={type === 'read' || type === 'edit'}
      />

      <ProFormText label="Access Key" name="ak" disabled={type === 'read'} />

      <ProFormText label="Secret Access Key" name="sk" disabled={type === 'read'} />
      <ProFormRadio.Group
        label="是否校验sign"
        name="checkSign"
        disabled={type === 'read'}
        placeholder="请选择"
        options={[
          { label: '校验', value: 'YES' },
          { label: '不校验', value: 'NO' },
        ]}
      />
      <ProFormRadio.Group
        label="是否可重试"
        name="retryable"
        disabled={type === 'read'}
        placeholder="请选择"
        options={[
          { label: '重试', value: 'YES' },
          { label: '不重试', value: 'NO' },
        ]}
      />
      <ProFormDigit label="超时时间(秒)" name="timeout" disabled={type === 'read'} />
    </ModalForm>
  );
};

export default AppForm;
