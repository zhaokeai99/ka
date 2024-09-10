import { ProFormDatePicker, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import React, { useEffect, useState } from 'react';

const ClearAddFrom = (props: {
  modalType: string;
  formRef: any;
  values: any;
  formVisible: boolean;
}) => {
  const { modalType, formRef, values, formVisible } = props;
  const [colProps] = useState({ md: 12, xl: 12 });

  useEffect(() => {
    if (formVisible && modalType === 'edit') {
      formRef.current?.setFieldsValue({
        ...values,
        clearTriggerDate: values?.clearTriggerDate || undefined,
      });
    }
  }, [props]);

  return (
    <>
      <ProFormText colProps={colProps} name="fundName" label="产品名称" />
      <ProFormText colProps={colProps} name="fundTypeLevel2" label="产品类型" />
      <ProFormText colProps={colProps} name="fundManager" label="基金经理" />
      <ProFormText colProps={colProps} name="productManager" label="产品经理" />
      <ProFormText colProps={colProps} name="trusteeBank" label="托管行" />
      <ProFormText colProps={colProps} name="launchDepartment" label="发起部门" />
      <ProFormText colProps={colProps} name="launchBackground" label="发起背景" />
      <ProFormDatePicker
        colProps={colProps}
        width={'md'}
        name="clearTriggerDate"
        fieldProps={{
          format: 'YYYY/MM/DD',
        }}
        label="清盘触发日"
      />
      <ProFormText colProps={colProps} name="priorReport" label="事前报备" />
      <ProFormText colProps={colProps} name="fundClearProcess" label="基金清盘流程" />
      <ProFormText colProps={colProps} name="clearDoneReport" label="清盘完成报备" />
      <ProFormText colProps={colProps} name="publishClearNotice" label="披露清算公告" />
      {modalType === 'add' ? (
        <ProFormSwitch
          colProps={colProps}
          placeholder="请输入显示操作"
          name="status"
          label="显示操作"
        />
      ) : (
        ''
      )}
    </>
  );
};

export default ClearAddFrom;
