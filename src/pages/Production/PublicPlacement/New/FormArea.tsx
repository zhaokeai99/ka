import { ProFormDateRangePicker, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const NewAddForm = (props: {
  modalType: string;
  formRef: any;
  values: any;
  formVisible: boolean;
}) => {
  const { modalType, formRef, values, formVisible } = props;
  const [colProps] = useState({ md: 12, xl: 12 });

  useEffect(() => {
    if (formVisible && modalType === 'edit') {
      let year: number | null = null;
      // 如果是编辑操作,回显数据
      const schedule = values?.releaseSchedule?.split('-').map((item: string, i) => {
        if (i === 0) {
          year = moment(item, 'YYYY-MM-DD').year();
        }
        if (i === 1 && !moment(item, 'YYYY-MM-DD').year()) {
          return `${year}-${moment(item, 'MM-DD').format('MM-DD')}`;
        }
        return moment(item, 'YYYY-MM-DD').format('YYYY-MM-DD');
      });
      formRef.current?.setFieldsValue({
        ...values,
        releaseSchedule: schedule.length > 1 ? schedule : '',
      });
    }
  }, [props]);

  return (
    <>
      <ProFormText
        colProps={colProps}
        placeholder="请输入产品名称"
        name="fundName"
        label="产品名称"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入公司业务线"
        name="companyBusinessLine"
        label="公司业务线"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入产品类型"
        name="fundTypeLevel2"
        label="产品类型"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入基金经理"
        name="fundManager"
        label="基金经理"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入产品经理"
        name="productManager"
        label="产品经理"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入托管行"
        name="trusteeBank"
        label="托管行"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入发起部门"
        name="launchDepartment"
        label="发起部门"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入发起背景"
        name="launchBackground"
        label="发起背景"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入方案评估"
        name="programmeEvaluate"
        label="方案评估"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入评估结果"
        name="evaluateResult"
        label="评估结果"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入准备待报"
        name="planReport"
        label="准备待报"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入上报受理"
        name="reportDeal"
        label="上报受理"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入产品评审会"
        name="productEvaluateMeet"
        label="产品评审会"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入一次反馈"
        name="feedback"
        label="一次反馈"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入定稿待批"
        name="finalizeApprove"
        label="定稿待批"
      />
      <ProFormText
        colProps={colProps}
        placeholder="请输入批复待发"
        name="approveRelease"
        label="批复待发"
      />
      <ProFormDateRangePicker colProps={colProps} name="releaseSchedule" label="合同生效时间" />
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

export default NewAddForm;
