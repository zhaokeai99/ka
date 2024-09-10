import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import {
  addAgencyDeptInfo,
  updateAgencyDeptInfo,
  queryDeptInfoByAgencyNo,
  queryAgencyInfo,
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
  const { visible, modalType } = props;
  const [initStates] = useState({
    dptName: '',
    parentId: '',
    agencyNo: '',
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
        result = await addAgencyDeptInfo(value);
      } else {
        result = await updateAgencyDeptInfo({
          ...value,
          dptId: props.initValues.dptId,
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
        name="dptName"
        label="部门名称"
        placeholder="请输入部门名称"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="agencyNo"
        label="所属机构"
        request={async () => {
          return await queryAgencyInfo();
        }}
        placeholder="请选择类型"
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['agencyNo']}>
        {({ agencyNo }) => {
          if (agencyNo) {
            return (
              <ProFormSelect
                name="parentId"
                label="所属部门"
                params={{ agencyNo: agencyNo }}
                request={async (params) => {
                  return await queryDeptInfoByAgencyNo(params);
                }}
                placeholder="请选择所属部门"
              />
            );
          }
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

export default memo(DetailModal);
