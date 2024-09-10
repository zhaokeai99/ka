import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import React, { useEffect, useState } from 'react';

const PolicyAddFrom = (props: {
  modalType: string;
  formRef: any;
  values: any;
  formVisible: boolean;
}) => {
  const { modalType, formRef, values, formVisible } = props;
  const [colProps] = useState({ md: 12, xl: 12 });

  useEffect(() => {
    if (formVisible && modalType === 'edit') {
      // 如果是编辑操作,回显数据
      formRef.current?.setFieldsValue(values);
    }
  }, [props]);

  return (
    <>
      <ProFormText colProps={colProps} name="fundCategory" label="产品大类" />
      <ProFormText colProps={colProps} name="subdivideCategory" label="细分类型" />
      <ProFormText colProps={colProps} name="dealStatus" label="受理状态" />
      <ProFormText colProps={colProps} name="titleCategory" label="标题分类" />
      <ProFormText colProps={colProps} name="title" label="标题" />
      {/* <ProFormText colProps={colProps} name="content" label="内容描述" /> */}
      <ProFormTextArea colProps={colProps} label="内容描述" name="content" />
    </>
  );
};

export default PolicyAddFrom;
