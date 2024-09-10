import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
// import UploadItem from '@/components/UploadItem';
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
    agencyId: '',
    agencyName: '',
    agencyType: '1',
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
          agencyId: props.initValues.agencyId,
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
        name="agencyName"
        label="机构名称"
        placeholder="请输入机构名称"
        fieldProps={{
          showCount: true,
          maxLength: 64,
        }}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="agencyType"
        label="机构类型"
        disabled={true}
        placeholder="请输入机构类型"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
