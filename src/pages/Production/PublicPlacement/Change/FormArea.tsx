import { ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import React, { useEffect, useState } from 'react';

const ChangeAddFrom = (props: {
  modalType: string;
  formRef: any;
  values: any;
  formVisible: boolean;
}) => {
  const { modalType, formRef, values, formVisible } = props;
  const [colProps] = useState({ md: 12, xl: 12 });

  useEffect(() => {
    if (formVisible && modalType === 'edit') {
      formRef.current?.setFieldsValue(values);
    }
  }, [props]);

  return (
    <>
      <ProFormText colProps={colProps} name="fundName" label="产品名称" />
      <ProFormText colProps={colProps} name="companyBusinessLine" label="公司业务线" />
      <ProFormText colProps={colProps} name="fundTypeLevel2" label="产品类型" />
      <ProFormText colProps={colProps} name="fundManager" label="基金经理" />
      <ProFormText colProps={colProps} name="productManager" label="产品经理" />
      <ProFormText colProps={colProps} name="trusteeBank" label="托管行" />
      <ProFormText colProps={colProps} name="launchDepartment" label="发起部门" />
      <ProFormText colProps={colProps} name="launchBackground" label="发起背景" />
      <ProFormText colProps={colProps} name="programmeEvaluate" label="方案评估" />
      <ProFormText colProps={colProps} name="evaluateResult" label="评估结果" />
      <ProFormText colProps={colProps} name="planReport" label="准备待报" />
      <ProFormText colProps={colProps} name="reportDeal" label="上报受理" />
      <ProFormText colProps={colProps} name="feedback" label="一次反馈" />
      <ProFormText colProps={colProps} name="finalizeApprove" label="定稿待批" />
      <ProFormText colProps={colProps} name="conveneHolderMeet" label="召开持有人大会" />
      <ProFormText colProps={colProps} name="approveRelease" label="批复待发" />
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

export default ChangeAddFrom;
