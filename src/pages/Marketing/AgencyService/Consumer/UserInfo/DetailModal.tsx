import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import {
  userInfoConfig,
  userInfoConfigUpdate,
  queryAgencyInfo,
  userTypeEnum,
  verifyEnum,
  wechatBindEnum,
  queryDeptInfo,
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
  const [initStates] = useState({
    userName: '',
    userType: '',
    mobile: '',
    agencyNo: '',
    deptId: '',
    verify: '',
    wechatBind: '',
  });

  useEffect(() => {
    if (visible) {
      if (modalType === 'edit' && Object.keys(initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          if (key === 'verify' || key === 'wechatBind') {
            formValues[key] = typeof initValues[key] == 'number' ? `${initValues[key]}` : '';
          } else {
            formValues[key] = initValues[key] || '';
          }
        });
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [visible, modalType, initValues]);

  const handleResetField = useCallback((key, value = '') => {
    formRef.current?.setFieldsValue({ [key]: value });
  }, []);

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      if (props.modalType === 'add') {
        result = await userInfoConfig(value);
      } else {
        result = await userInfoConfigUpdate({
          ...value,
          userId: props.initValues.userId,
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
      title={modalType === 'add' ? '配置' : '修改配置'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="userName"
        label="客户名称"
        placeholder="请输入客户名称"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="userType"
        label="客户类型"
        valueEnum={userTypeEnum}
        placeholder="请选择客户类型"
        rules={[{ required: true }]}
        fieldProps={{
          onChange: () => handleResetField('agencyNo'),
        }}
      />
      <ProFormText
        name="mobile"
        label="手机号"
        placeholder="请输入手机号"
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['userType']}>
        {({ userType }) => {
          return (
            <ProFormSelect
              name="agencyNo"
              label="机构"
              fieldProps={{
                showSearch: true,
                onChange: () => handleResetField('deptId'),
              }}
              params={{ userType: userType }}
              request={async (params) => {
                const list = await queryAgencyInfo({
                  agencyName: params.keyWords || '',
                  agencyType: params.userType,
                  currentPage: 1,
                  pageSize: 100,
                });
                return list;
              }}
              placeholder="请输入机构"
              rules={[{ required: true }]}
            />
          );
        }}
      </ProFormDependency>
      <ProFormDependency name={['agencyNo']}>
        {({ agencyNo }) => {
          if (!agencyNo) return null;
          return (
            <ProFormSelect
              name="deptId"
              label="部门"
              showSearch
              params={{ agencyNo: agencyNo }}
              request={async (params) => {
                return await queryDeptInfo(params);
              }}
              placeholder="请输入部门"
            />
          );
        }}
      </ProFormDependency>
      {modalType === 'edit' && (
        <ProFormSelect
          name="verify"
          label="审核状态"
          valueEnum={verifyEnum}
          placeholder="请选择审核状态"
          rules={[{ required: true }]}
        />
      )}
      {modalType === 'edit' && initValues?.registerState !== 0 && (
        <ProFormSelect
          name="wechatBind"
          label="微信绑定状态"
          valueEnum={wechatBindEnum}
          placeholder="请选择微信绑定状态"
          rules={[{ required: true }]}
        />
      )}
    </ModalForm>
  );
};

export default memo(DetailModal);
