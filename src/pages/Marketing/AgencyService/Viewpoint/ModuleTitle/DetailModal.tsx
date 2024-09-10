import React, { useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import {
  addModuleTitleConfig,
  updateModuleTitleConfig,
  queryModuleTitlePageTypeDesc,
  queryModuleTitleModuleTypeDesc,
  queryModuleTitleTitleTypeDesc,
} from './service';

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
        result = await addModuleTitleConfig(value);
      } else {
        result = await updateModuleTitleConfig({
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
      <ProFormText
        name="title"
        label="标题"
        placeholder="请输入标题"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="pageType"
        label="页面类型"
        placeholder="请选择页面类型"
        request={async () => {
          return await queryModuleTitlePageTypeDesc();
        }}
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['pageType']}>
        {({ pageType }) => {
          if (pageType !== undefined) {
            return (
              <ProFormSelect
                name="moduleType"
                label="模块类型"
                placeholder="请选择模块类型"
                request={async () => {
                  return await queryModuleTitleModuleTypeDesc({ pageType });
                }}
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['moduleType']}>
        {({ moduleType }) => {
          if (moduleType !== undefined) {
            return (
              <ProFormSelect
                name="titleType"
                label="标题类型"
                placeholder="请选择标题类型"
                request={async () => {
                  return await queryModuleTitleTitleTypeDesc({ moduleType });
                }}
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

export default memo(DetailModal);
