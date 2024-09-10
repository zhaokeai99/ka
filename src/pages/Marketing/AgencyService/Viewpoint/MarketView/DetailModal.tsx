import React, { useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { addMarketViewPoint, updateMarketViewPoint, queryMarketViewPointTypeDesc } from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType, initValues } = props;

  useEffect(() => {
    if (visible) {
      if (modalType === 'edit' && Object.keys(initValues).length >= 0) {
        formRef.current?.setFieldsValue(initValues);
      }
    }
  }, [props]);

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      if (modalType === 'add') {
        result = await addMarketViewPoint(value);
      } else {
        result = await updateMarketViewPoint({
          ...value,
          id: initValues.id,
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
      modalProps={{
        onCancel: () => {
          props.onClose('cancel');
          formRef.current?.resetFields();
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        name="viewpointType"
        label="观点类型"
        placeholder="请选择观点类型"
        request={async () => {
          return await queryMarketViewPointTypeDesc();
        }}
        rules={[{ required: true }]}
      />
      <ProFormDateTimePicker
        name="viewpointDate"
        label="观点时间"
        width="100%"
        rules={[{ required: true }]}
      />
      <ProFormDigit name="optimismAgencyNumber" label="乐观机构个数" rules={[{ required: true }]} />
      <ProFormDigit
        name="neutralityAgencyNumber"
        label="中立机构个数"
        rules={[{ required: true }]}
      />
      <ProFormDigit name="cautiousAgencyNumber" label="谨慎机构个数" rules={[{ required: true }]} />
    </ModalForm>
  );
};

export default memo(DetailModal);
