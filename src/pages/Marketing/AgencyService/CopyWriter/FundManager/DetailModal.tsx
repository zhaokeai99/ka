import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import UploadItem from '@/components/UploadItem';
import { addFundManager, updateFundManager } from './service';

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
    fundManagerName: '',
    defaultIntroduction: '',
    photoUrl: '',
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
        result = await addFundManager(value);
      } else {
        result = await updateFundManager({
          ...value,
          fundManagerId: props.initValues.fundManagerId,
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
        name="fundManagerName"
        label="基金经理姓名"
        placeholder="请输入基金经理姓名"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="defaultIntroduction"
        label="基金经理默认简介"
        placeholder="请输入基金经理默认简介"
        rules={[{ required: true }]}
      />
      <UploadItem
        required
        accept=".jpg, .jpeg, .png"
        name="photoUrl"
        label="基金经理头像"
        formRef={formRef}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
