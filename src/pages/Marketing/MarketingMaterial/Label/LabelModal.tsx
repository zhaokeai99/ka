import React, { useEffect, useRef, useState } from 'react';
import { ModalForm, ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { message } from 'antd';
import { labelAdd, labelUpdate } from '../service';

type PropsType = {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
};

const LabelModal = (props: PropsType) => {
  const { visible, modalType, onClose, initValues } = props;
  const formRef = useRef<ProFormInstance>();
  const [initStates] = useState({
    labelName: '',
    labelDesc: '',
  });

  useEffect(() => {
    if (visible) {
      if (modalType === 'EDIT') {
        formRef.current?.setFieldsValue(initValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [visible, modalType, initValues]);

  const handleSubmit = async (values: any) => {
    let res: any = {};
    if (modalType === 'ADD') {
      res = await labelAdd({ ...values });
    } else {
      res = await labelUpdate({ ...values, labelId: initValues?.labelId });
    }

    if (res?.success) {
      message.success(`${modalType === 'ADD' ? '新增成功' : '编辑成功'}`);
      onClose('RELOAD');
    }
  };

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout="horizontal"
      title={modalType === 'ADD' ? '新增' : '编辑'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => onClose('CANCEL'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText label="标签名称" name="labelName" rules={[{ required: true }]} />
      <ProFormTextArea label="标签描述" name="labelDesc" rules={[{ required: true }]} />
    </ModalForm>
  );
};

export default LabelModal;
