import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { addProduct, updateProduct } from './service';
import { queryDivisionManager } from '@/pages/Fundsalesmrksupport/Manage/Seasons/service';
import { transOptions } from '@/utils/utils';

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
    divisionId: '',
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

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      if (props.modalType === 'add') {
        result = await addProduct({
          ...value,
        });
      } else {
        result = await updateProduct({
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
      <ProFormSelect
        name="divisionId"
        label="赛区名称"
        request={async () => {
          const divisionVar = await queryDivisionManager({});
          return transOptions(divisionVar, 'divisionName', 'divisionId', false);
        }}
        placeholder="请选择赛区名称"
        showSearch
        disabled={modalType === 'edit'}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="fundCode"
        label="基金代码"
        placeholder="请输入基金代码,输入多个则用逗号或回车隔开"
        rules={[{ required: true }]}
        hidden={modalType === 'edit'}
      />
      <ProFormText
        name="fundCode"
        label="基金代码"
        placeholder="请输入基金代码,最多6个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 6,
        }}
        hidden={modalType === 'add'}
        disabled={modalType === 'edit'}
      />
      <ProFormText
        name="fundName"
        label="基金名称"
        placeholder="请输入基金名称"
        hidden={modalType === 'add'}
        disabled={modalType === 'edit'}
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
        hidden={modalType === 'add'}
        placeholder="请输入买入费率，默认：0.000000"
        rules={[{ required: modalType === 'edit' }]}
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
        fieldProps={{
          showCount: true,
          maxLength: 60,
        }}
        hidden={modalType === 'add'}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
