import React, { useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import { getSecurityTypes, getStandardSecurityByType, addSecuritiesIndustry } from '../service';

interface ModalProps {
  visible: boolean;
  onClose: (val?: string) => void;
}

// 弹窗
const AddSecuritiesIndustry = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible } = props;
  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      result = await addSecuritiesIndustry({
        ...value,
      });
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
      title={'新增行业体系'}
      formRef={formRef}
      modalProps={{
        onCancel: () => {
          props.onClose('cancel');
          formRef.current?.resetFields();
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="name"
        label="体系名称"
        placeholder="请输入体系名称"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="type"
        label="证券类型"
        request={async () => {
          return await getSecurityTypes();
        }}
        placeholder="请选择证券类型"
        rules={[{ required: true }]}
        fieldProps={{
          onChange: () => {
            formRef?.current?.setFieldsValue({ traceSysId: '' });
          },
        }}
      />
      <ProFormDependency name={['type']}>
        {({ type }) => {
          if (!type) return null;
          return (
            <ProFormSelect
              name="traceSysId"
              label="跟踪标准体系"
              rules={[{ required: true }]}
              params={{ type: type }}
              request={async (params) => {
                return await getStandardSecurityByType(params);
              }}
              placeholder="请选择跟踪标准体系"
            />
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

export default memo(AddSecuritiesIndustry);
