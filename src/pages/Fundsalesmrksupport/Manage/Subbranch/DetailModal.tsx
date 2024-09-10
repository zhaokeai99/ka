import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import {
  addSubBranch,
  updateSubBranch,
  queryDpt,
  queryAgencyByDivisionId,
  queryDivisionManager,
  queryAgency,
} from './service';
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
    netName: '',
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
      if (props.modalType === 'add') {
        result = await addSubBranch({
          ...value,
          dptType: 1,
        });
      } else if (props.modalType === 'addNet') {
        result = await addSubBranch({
          ...value,
          dptName: value.netName,
          dptType: 2,
          parentId: value.dptId,
        });
      } else {
        result = await updateSubBranch({
          ...value,
          dptId: value.dptId,
          dptType: 1,
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

  const [agencyData, setAgencyData] = useState<any>(undefined);
  const getAgencyByDivisionId = useCallback(async (value) => {
    const result = await queryAgencyByDivisionId({
      ...value,
      divisionId: value,
    });
    setAgencyData(transOptions(result, 'agencyName', 'agencyId', false));
  }, []);

  const [dptNameData, setdptNameData] = useState<any>(undefined);
  const getdptNameByAgencyId = useCallback(async (value) => {
    const result = await queryDpt({
      ...value,
      agencyId: value,
    });
    setdptNameData(transOptions(result, 'dptName', 'dptId', false));
  }, []);

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
        fieldProps={{
          onChange: (value) => {
            formRef?.current?.setFieldsValue({ agencyId: '', parentId: '' });
            getAgencyByDivisionId(value);
          },
        }}
        disabled={modalType != 'add'}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="agencyId"
        label="机构名称"
        showSearch
        options={agencyData}
        disabled={modalType === 'edit'}
        hidden={modalType != 'add'}
        rules={[{ required: true }]}
        placeholder="请选择机构名称"
        fieldProps={{
          onChange: (value) => {
            formRef?.current?.setFieldsValue({ parentId: '' });
            getdptNameByAgencyId(value);
          },
        }}
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
        name="parentId"
        label="分行名称"
        showSearch
        options={dptNameData}
        disabled={modalType === 'edit'}
        hidden={modalType != 'add'}
        rules={[{ required: true }]}
        placeholder="请选择分行名称"
      />
      <ProFormSelect
        name="parentId"
        label="分行名称"
        placeholder="请选择分行名称"
        request={async () => {
          const data = await queryDpt();
          return data?.map((item: any) => {
            return {
              label: item?.dptName,
              value: item?.dptId,
            };
          });
        }}
        rules={[{ required: true }]}
        disabled={modalType != 'add'}
        hidden={modalType === 'add'}
      />
      <ProFormTextArea
        name="dptName"
        label="支行名称"
        placeholder="请输入支行名称,输入多个则用逗号或回车隔开"
        rules={[{ required: true }]}
        hidden={modalType != 'add'}
      />
      <ProFormText
        name="dptName"
        label="支行名称"
        placeholder="请输入部门名称,最多64个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 64,
        }}
        disabled={modalType === 'addNet'}
        hidden={modalType === 'add'}
      />
      <ProFormText
        name="dptId"
        label="支行ID"
        rules={[{ required: modalType === 'addNet' }]}
        hidden={true}
      />
      <ProFormTextArea
        name="netName"
        label="网点名称"
        placeholder="请输入网点名称,输入多个则用逗号或回车隔开"
        rules={[{ required: modalType === 'addNet' }]}
        hidden={modalType != 'addNet'}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
