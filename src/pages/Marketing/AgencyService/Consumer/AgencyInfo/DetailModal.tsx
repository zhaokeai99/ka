import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import { addAgencyInfo, updateAgencyInfo } from './service';

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
    agencyType: '',
    agencyName: '',
    extInfo: '',
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
        result = await addAgencyInfo(value);
      } else {
        result = await updateAgencyInfo({
          ...value,
          agencyNo: props.initValues.agencyNo,
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
        name="agencyName"
        label="机构名称"
        placeholder="请输入机构名称"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="agencyType"
        label="机构类型"
        options={[
          { label: '内部机构', value: '1' },
          { label: '外部机构', value: '0' },
        ]}
        placeholder="请选择机构类型"
        rules={[{ required: true }]}
      />
      <ProFormTextArea name="extInfo" label="扩展信息" placeholder="请输入扩展信息" />
    </ModalForm>
  );
};

export default memo(DetailModal);
