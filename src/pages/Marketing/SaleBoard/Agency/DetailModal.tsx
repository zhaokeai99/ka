import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import { ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { setAgencyKind, getDictInfoByType } from './service';

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
    agencyCode: '',
    agencyName: '',
    agencyKindName: '',
    agencySubKind: '',
  });

  const [subKind, setSubKind] = useState([]);

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

  useEffect(() => {
    if (props.visible) {
      getDictInfoByType({
        dictType: 'agency_sub_kind',
        parentKey: props.initValues.agencyKind,
      }).then((res) => {
        setSubKind(res);
      });
    }
  }, [props.initValues.agencyKind]);

  const handleSubmit = useCallback(
    async (value) => {
      const { success, errorMsg } = await setAgencyKind({
        agencyCode: props.initValues.agencyCode,
        agencySubKind: value.agencySubKind,
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
      title="渠道二级分类配置"
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText name="agencyCode" label="渠道编码" rules={[{ required: true }]} disabled />
      <ProFormText name="agencyName" label="渠道名称" rules={[{ required: true }]} disabled />
      <ProFormText
        name="agencyKindName"
        label="渠道一级分类"
        rules={[{ required: true }]}
        disabled
      />
      <ProFormSelect
        name="agencySubKind"
        label="渠道二级分类"
        placeholder="请选择渠道二级分类"
        rules={[{ required: true }]}
        options={subKind}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
