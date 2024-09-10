import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { addDictType } from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType, initValues, onClose } = props;
  const [initStates] = useState({
    dictTypeId: '',
    dictTypeName: '',
    memo: '',
  });

  useEffect(() => {
    if (visible) {
      if (modalType === 'edit' && Object.keys(initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = initValues[key] || '';
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
      if (modalType === 'add') {
        result = await addDictType(value);
      }
      if (result.success) {
        onClose('reload');
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
        onCancel: () => onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="dictTypeId"
        label="字典类型"
        placeholder="请输入字典类型"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="dictTypeName"
        label="字典类型描述"
        placeholder="请输入字典类型描述"
        rules={[{ required: true }]}
      />
      <ProFormText name="memo" label="备注" placeholder="请输入备注信息" />
    </ModalForm>
  );
};

export default memo(DetailModal);
