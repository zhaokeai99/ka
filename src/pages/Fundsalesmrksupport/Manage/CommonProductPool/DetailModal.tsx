import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { addChallengeCommonProduct, updateChallengeCommonProduct } from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType } = props;

  const [initStates] = useState({
    fundCode: '',
    wProductCode: '',
    fundName: '',
    companyName: '',
    buyRate: '',
    redeemRate: '',
    gmtCreate: '',
    gmtModified: '',
  });

  useEffect(() => {
    if (props.visible) {
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [props]);

  const regex = /[^0-9]/;
  const handleSubmit = useCallback(
    async (value) => {
      if (regex.test(value.fundCode)) {
        message.error('基金代码只能由阿拉伯数字组成');
        return;
      }
      let result: any = {};
      if (props.modalType === 'add') {
        result = await addChallengeCommonProduct({
          ...value,
        });
      } else {
        result = await updateChallengeCommonProduct({
          ...value,
        });
      }
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
      title={modalType === 'add' ? '新增' : '编辑'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="fundCode"
        label="基金代码"
        placeholder="请输入基金代码,最多6个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 6,
        }}
        disabled={modalType === 'edit'}
      />
      <ProFormText
        name="fundName"
        label="基金名称"
        placeholder="请输入基金名称"
        disabled={modalType === 'edit'}
        hidden={modalType === 'add'}
        rules={[{ required: modalType === 'edit' }]}
      />
      <ProFormText
        name="wProductCode"
        label="wind代码"
        placeholder="请输入wind代码"
        hidden={modalType === 'add'}
        rules={[{ required: modalType === 'edit' }]}
      />
      <ProFormDigit
        name="buyRate"
        label="买入费率"
        fieldProps={{ precision: 6 }}
        max={0.999999}
        min={0}
        rules={[{ required: modalType === 'edit' }]}
        placeholder="请输入买入费率，默认：0.000000"
        hidden={modalType === 'add'}
      />
      <ProFormDigit
        name="redeemRate"
        label="卖出费率"
        fieldProps={{ precision: 6 }}
        max={0.999999}
        min={0}
        placeholder="请输入卖出费率，默认：0.000000"
        rules={[{ required: modalType === 'edit' }]}
        hidden={modalType === 'add'}
      />
      <ProFormText
        name="companyName"
        label="基金公司名称"
        placeholder="请输入基金公司名称"
        hidden={modalType === 'add'}
        fieldProps={{
          showCount: true,
          maxLength: 60,
        }}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
