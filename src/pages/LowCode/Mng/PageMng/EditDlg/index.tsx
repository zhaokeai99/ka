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
          params.pageId = initialValues.pageId;
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
        label="PageID"
        name="pageId"
        disabled={type === 'edit'}
        placeholder="英文字母加下划线格式"
        rules={[{ required: true, message: '请录入英文字母加下划线格式ID!' }]}
      />
      <ProFormText
        label="标题"
        name="title"
        placeholder="中文名字，展示提示"
        rules={[{ required: true, message: '请录入页面中文名字!' }]}
      />
      <ProFormTextArea
        label="描述"
        name="description"
        placeholder="页面描述信息"
        rules={[{ required: true, message: '请录入一些页面描述!' }]}
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
      <h3 style={{ marginLeft: 150 }}>
        {type === 'edit' ? '编辑布局请点击列表的编辑布局操作！' : '新建保存完毕去列表编辑布局！'}
      </h3>
    </ModalForm>
  );
};

export default EditDlg;
