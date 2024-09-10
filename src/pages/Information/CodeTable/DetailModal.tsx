import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { addTypeCode, updateTypeCode } from './service';

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
    typeCode: '',
    typeName: '',
    subTypeCode: '',
    subTypeName: '',
    dataValue: '',
    remark: '',
    orderNum: '',
  });

  useEffect(() => {
    if (props.visible) {
      if (Object.keys(props.initValues).length >= 0) {
        const formValues = initStates;
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [initStates, props]);

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      if (props.modalType === 'add') {
        result = await addTypeCode(value);
      } else {
        result = await updateTypeCode({
          ...value,
          id: props.initValues.id,
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
        required
        name="typeCode"
        label="类型编码"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
      <ProFormText
        required
        name="typeName"
        label="类型名称"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
      <ProFormText
        required
        name="subTypeCode"
        label="编码"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
      <ProFormText
        required
        name="subTypeName"
        label="名称"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        required
        name="dataValue"
        label="值"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        required
        name="remark"
        label="备注"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
      <ProFormText
        required
        name="orderNum"
        label="排序"
        placeholder="请输入名称"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
