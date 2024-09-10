import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormDatePicker } from '@ant-design/pro-form';
import { addPeerDynamicState, updatePeerDynamicState } from './service';

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
    dynamicDate: null,
    fundFlowIntoRatio: '',
    fundFlowIntoProductName: '',
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
        result = await addPeerDynamicState(value);
      } else {
        result = await updatePeerDynamicState({
          ...value,
          id: props.initValues.id,
        });
      }
      if (result.success) {
        props.onClose('reload');
        formRef.current?.resetFields();
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
        onCancel: () => {
          props.onClose('cancel');
          formRef.current?.resetFields();
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="fundFlowIntoProductName"
        label="资金流入产品名称"
        placeholder="请输入资金流入产品名称"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="fundFlowIntoRatio"
        label="资金流入比例"
        placeholder="请输入资金流入比例"
        rules={[{ required: true }]}
      />
      <ProFormDatePicker
        style={{ width: '100%' }}
        name="dynamicDate"
        label="动态日期"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
