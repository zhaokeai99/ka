import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { useEffect, useRef } from 'react';

const Form: React.FC<{
  visible: boolean;
  onVisibleChange: (any) => any;
  onFinish: (any) => any;
  type: 'edit' | 'add';
  title: string;
  initialValues?: any;
}> = ({ visible, type, title, initialValues, onVisibleChange, onFinish }) => {
  const formRef = useRef<FormInstance>();

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
      title={title}
      formRef={formRef}
      visible={visible}
      onFinish={async (values) => {
        const result = await onFinish({
          ...values,
          ...(type === 'edit' && { id: initialValues.id }),
        });
        if (result) {
          formRef.current?.resetFields();
          return true;
        }
        return false;
      }}
      layout={'horizontal'}
      onVisibleChange={onVisibleChange}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      <ProFormText label="部门" name="department" rules={[{ required: true }]} />
      <ProFormText label="业务类型" name="busiType" rules={[{ required: true }]} />
      <ProFormText label="联系人" name="contacts" rules={[{ required: true }]} />
      <ProFormText label="手机" name="mobile" rules={[{ required: true }]} />
      <ProFormText label="座机" name="telephone" />
      <ProFormText label="邮箱" name="email" />
      <ProFormText label="传真" name="fax" />
    </ModalForm>
  );
};

export default Form;
