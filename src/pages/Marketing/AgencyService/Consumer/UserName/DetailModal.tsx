import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { updateUserInfo, getInvestorName } from './service';

interface ModalProps {
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, initValues } = props;
  const [initStates] = useState({
    userId: '',
    investorNameList: [],
  });

  useEffect(() => {
    if (props.visible) {
      formRef.current?.setFieldsValue({
        userId: props.initValues.userId,
        investorNameList: props.initValues.investorNames || [],
      });
    }
  }, [props]);

  const handleSubmit = useCallback(
    async (value) => {
      const result = await updateUserInfo({
        ...value,
        fundManagerId: props.initValues.fundManagerId,
      });
      if (result.success) {
        props.onClose('reload');
        return;
      }
      message.error(result.errorMsg || '接口请求失败');
    },
    [props],
  );

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title={'配置用户户名'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        bodyStyle: { minHeight: '240px' },
      }}
      onFinish={handleSubmit}
    >
      <ProFormText name="userId" label="用户ID" readonly rules={[{ required: true }]} />
      <ProFormSelect
        name="investorNameList"
        label="资产账户"
        mode="multiple"
        params={{ agencyName: initValues.agencyName }}
        request={async (params) => {
          return await getInvestorName(params);
        }}
        placeholder="请输入资产账户"
        // rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
