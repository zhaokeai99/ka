import { ModalForm, ProFormInstance } from '@ant-design/pro-form';
import FormArea from './FormArea';
import React, { useCallback, useRef } from 'react';
import { addProductExaminePolicy, updateProductExaminePolicy } from '../service';
import { message } from 'antd';

interface ModalProps {
  formVisible: boolean;
  modalType: string;
  values?: any;
  onClose: (formObj: any, val?: string) => void;
}

const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { modalType, onClose, formVisible, values } = props;

  // 添加/修改
  const addProduct = useCallback(
    async (formObj: any) => {
      let res: any = {};
      if (modalType === 'add') {
        res = await addProductExaminePolicy({
          content: formObj?.content || '',
          dealStatus: formObj?.dealStatus || '',
          fundCategory: formObj?.fundCategory || '',
          subdivideCategory: formObj?.subdivideCategory || '',
          title: formObj?.title || '',
          titleCategory: formObj?.titleCategory || '',
        });
      } else {
        res = await updateProductExaminePolicy({
          ...values,
          content: formObj?.content || '',
          dealStatus: formObj?.dealStatus || '',
          fundCategory: formObj?.fundCategory || '',
          subdivideCategory: formObj?.subdivideCategory || '',
          title: formObj?.title || '',
          titleCategory: formObj?.titleCategory || '',
        });
      }
      if (res?.data) {
        message.success(modalType === 'add' ? '新增成功' : '修改成功');
        formRef.current?.resetFields();
        onClose('reload');
        return;
      }
      message.error(modalType === 'add' ? '新增失败' : '修好失败');
    },
    [props],
  );

  return (
    <ModalForm
      title={modalType === 'add' ? '新增' : '修改'}
      formRef={formRef}
      visible={formVisible}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout={'horizontal'}
      style={{ padding: '0 12px' }}
      grid={true}
      labelAlign="right"
      modalProps={{
        onCancel: () => {
          props.onClose('cancel');
          formRef.current?.resetFields();
        },
      }}
      onFinish={async (val) => {
        addProduct(val);
      }}
    >
      <FormArea modalType={modalType} formRef={formRef} values={values} formVisible={formVisible} />
    </ModalForm>
  );
};

export default DetailModal;
