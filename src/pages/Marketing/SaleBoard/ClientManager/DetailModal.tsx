import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import { ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { setClientManagerSalesType, getDictInfoByType } from './service';

interface ModalProps {
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible } = props;
  const [initStates] = useState({
    userDomain: '',
    userTrueName: '',
    deptName: '',
    salesKind: '',
  });

  useEffect(() => {
    if (props.visible) {
      if (Object.keys(props.initValues).length >= 0) {
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
      const { success, errorMsg } = await setClientManagerSalesType({
        ...value,
      });
      if (success) {
        props.onClose('reload');
        return;
      }
      message.error(errorMsg || '接口请求失败');
    },
    [props],
  );

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title="客户经理配置"
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText name="userDomain" label="天弘域账号" rules={[{ required: true }]} disabled />
      <ProFormText name="userTrueName" label="姓名" rules={[{ required: true }]} disabled />
      <ProFormText name="deptName" label="所属部门" rules={[{ required: true }]} disabled />
      <ProFormSelect
        name="salesKind"
        label="销售类别"
        request={async () => {
          return await getDictInfoByType({ dictType: 'sales_kind' });
        }}
        placeholder="请选择销售类别"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
