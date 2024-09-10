import React, { useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { catAdd, catUpdate } from '../../service';
import { message } from 'antd';

type PropsType = {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
  tabId: string;
};

const CategoryModal = (props: PropsType) => {
  const { visible, modalType, onClose, initValues, tabId } = props;
  const formRef = useRef<ProFormInstance>();
  const [initStates] = useState({
    catName: '',
    catDesc: '',
    catOrder: '',
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
      res = await catAdd({ ...values, catModule: tabId });
    } else {
      res = await catUpdate({ ...values, catModule: tabId, catId: initValues?.catId });
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
      <ProFormText label="名称" name="catName" rules={[{ required: true }]} />
      <ProFormTextArea label="描述" name="catDesc" rules={[{ required: true }]} />
      <ProFormDigit
        label="排序"
        name="catOrder"
        rules={[{ required: true }]}
        fieldProps={{ min: 0 }}
      />
    </ModalForm>
  );
};

export default CategoryModal;
