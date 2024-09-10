import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { addVogChannel, updateVogChannel, getOrgType, getAgencyCode } from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType, initValues, onClose } = props;
  const [orgData, setOrgData] = useState<any>([]);
  const [orgSubData, setOrgSubData] = useState<any>(undefined);
  const [initStates] = useState({
    orgAgencyName: '',
    agencyCode: '',
    orgType: '',
    orgSubType: '',
  });

  const dataFn = (data: any) => {
    return data?.map((item: any) => {
      return {
        label: item?.dictValue,
        value: item?.dictKey,
        children: dataFn(item?.subDict || []),
      };
    });
  };

  const orgDataFn = async () => {
    const { data } = await getOrgType();
    const list = dataFn(data);
    setOrgData(list);
  };

  useEffect(() => {
    orgDataFn();
  }, []);

  const onChangeFn = useCallback(
    (val) => {
      const obj = orgData?.find((item: any) => item?.value === val)?.children || [];
      setOrgSubData(obj);
      formRef?.current?.setFieldsValue({ orgSubType: null });
    },
    [orgData],
  );

  useEffect(() => {
    onChangeFn(props.initValues.orgType);
    if (visible) {
      if (modalType === 'edit' && Object.keys(initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = initValues[key] || '';
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
      if (modalType === 'add') {
        result = await addVogChannel(value);
      } else {
        result = await updateVogChannel({
          ...value,
          orgAgencyCode: initValues.orgAgencyCode,
        });
      }
      if (result.success) {
        onClose('reload');
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
        onCancel: () => onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="orgAgencyName"
        label="客户简称"
        placeholder="请输入客户简称"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="agencyCode"
        label="关联渠道"
        request={async () => {
          return await getAgencyCode({});
        }}
        placeholder="请选择关联渠道"
        showSearch
        fieldProps={{ filterOption: (input, option) => option?.label?.indexOf(input) !== -1 }}
      />
      <ProFormSelect
        name="orgType"
        label="一级机构类型"
        options={orgData}
        placeholder="请选择一级机构类型"
        fieldProps={{ onChange: onChangeFn }}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="orgSubType"
        label="二级机构类型"
        options={orgSubData}
        placeholder="请选择二级机构类型"
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
