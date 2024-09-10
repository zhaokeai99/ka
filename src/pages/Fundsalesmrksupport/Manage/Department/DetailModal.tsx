import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import {
  addFundManager,
  updateFundManager,
  queryDivisionManager,
  queryAgencyByDivisionId,
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
    divisionId: '',
    agencyId: '',
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
          dptId: props.initValues.dptId,
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
            formRef?.current?.setFieldsValue({ agencyId: '' });
            getAgencyByDivisionId(value);
          },
        }}
        disabled={modalType === 'edit'}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="agencyId"
        label="机构名称"
        showSearch
        options={agencyData}
        disabled={modalType === 'edit'}
        hidden={modalType === 'edit'}
        rules={[{ required: true }]}
        placeholder="请选择机构名称"
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
        disabled={modalType === 'edit'}
        hidden={modalType === 'add'}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="dptName"
        label="分行名称"
        placeholder="请输入分行名称,输入多个则用逗号或回车隔开"
        rules={[{ required: true }]}
        hidden={modalType === 'edit'}
      />
      <ProFormText
        name="dptName"
        label="分行名称"
        placeholder="请输入分行名称,最多64个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 64,
        }}
        hidden={modalType === 'add'}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
