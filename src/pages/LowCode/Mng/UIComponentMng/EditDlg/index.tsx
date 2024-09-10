import React, { useRef, useEffect } from 'react';
import type { FormInstance } from 'antd';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

const EditDlg: React.FC<{
  visible: boolean;
  onFinish: (a: any) => any;
  type: 'edit' | 'add';
  title: string;
  initialValues?: any;
  onVisibleChange: (a: any) => any;
}> = ({ visible, type, title, initialValues, onVisibleChange, onFinish }) => {
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    if (formRef && formRef.current) {
      formRef.current.setFieldsValue({
        ...initialValues,
      });
    }
  }, [initialValues]);

  return (
    <ModalForm
      title={title}
      formRef={formRef}
      visible={!!visible}
      onFinish={async (values) => {
        const params = { ...values };

        if (type === 'edit') {
          params.id = initialValues.id;
        }

        const result = onFinish(params);
        return result;
      }}
      onVisibleChange={onVisibleChange}
      layout={'horizontal'}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      <ProFormText
        label="组件ID"
        name="componentId"
        disabled={type === 'edit'}
        placeholder="组件ID"
        rules={[{ required: true, message: '请录入组件ID!' }]}
      />
      <ProFormText
        label="组件名"
        name="componentName"
        disabled={type === 'edit'}
        placeholder="组件的导出名称"
        rules={[{ required: true, message: '请录入组件导出名字!' }]}
      />
      <ProFormText
        label="标题"
        name="title"
        placeholder="中文名字，展示提示"
        rules={[{ required: true, message: '请录入组件中文名字!' }]}
      />
      <ProFormTextArea
        label="描述"
        name="description"
        placeholder="组件描述信息"
        rules={[{ required: true, message: '请录入一些组件描述!' }]}
      />
      <ProFormText
        label="关键词"
        name="keywords"
        placeholder="搜索用，英文逗号分割"
        rules={[{ required: true, message: '请录入一些关键词方便搜索!' }]}
      />
      <ProFormText
        label="类目"
        name="category"
        placeholder="英文类目信息便与分类"
        rules={[{ required: true, message: '请录入类目!' }]}
      />
      <ProFormText
        label="APP"
        name="app"
        placeholder="归属应用"
        rules={[{ required: true, message: '请录入APP!' }]}
      />
      <ProFormText
        label="缩略图"
        name="imgUrl"
        placeholder="缩略图URL"
        rules={[{ required: true, message: '请录入组件缩略图!' }]}
      />
      <ProFormTextArea
        label="属性数据"
        name="props"
        placeholder="组件的描述信息"
        fieldProps={{ autoSize: { minRows: 5 } }}
        rules={[{ required: true, message: '请录入组件属性值!' }]}
      />
    </ModalForm>
  );
};

export default EditDlg;
