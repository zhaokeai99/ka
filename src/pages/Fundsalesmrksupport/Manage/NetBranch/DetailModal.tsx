import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { updateSubBranch, queryDivisionManager, queryAgency } from './service';
import { transOptions } from '@/utils/utils';

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
    dptId: '',
    dptName: '',
    agencyName: '',
    divisionName: '',
    parentId: '',
    parentName: '',
    divisionId: '',
    agencyId: '',
    netId: '',
    netName: '',
    subBranchName: '',
    subBranchId: '',
  });

  useEffect(() => {
    if (props.visible) {
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formRef.current?.setFieldsValue(formValues);
      } else if (props.modalType === 'addNet' && Object.keys(props.initValues).length >= 0) {
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
      if (props.modalType === 'edit') {
        result = await updateSubBranch({
          dptId: value.netId,
          dptName: value.netName,
          dptType: 2,
          parentId: value.subBranchId,
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
      title={modalType === 'edit' ? '编辑' : '新增'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        name="divisionId"
        label="赛区名称"
        request={async () => {
          const divisionVar = await queryDivisionManager({});
          return transOptions(divisionVar, 'divisionName', 'divisionId', false);
        }}
        placeholder="请选择赛区名称"
        showSearch
        disabled={modalType != 'add'}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="agencyId"
        label="机构名称"
        placeholder="请选择机构名称"
        request={async () => {
          const data = await queryAgency();
          return data?.map((item: any) => {
            return {
              label: item?.agencyName,
              value: item?.agencyId,
            };
          });
        }}
        disabled={modalType != 'add'}
        hidden={modalType === 'add'}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="dptName"
        label="分行名称"
        showSearch
        disabled={modalType === 'edit'}
        rules={[{ required: true }]}
        placeholder="请选择分行名称"
      />
      <ProFormText
        name="subBranchName"
        label="支行名称"
        placeholder="请输入部门名称,最多64个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 64,
        }}
        disabled={modalType != 'add'}
      />
      <ProFormText name="dptId" label="分行ID" hidden={true} />
      <ProFormText name="subBranchId" label="支行ID" hidden={true} />
      <ProFormText name="netId" label="网点ID" hidden={true} />
      <ProFormText
        name="netName"
        label="网点名称"
        placeholder="请输入网点名称"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 64,
        }}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
