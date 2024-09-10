import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import { ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { setFundVogType, getDictInfoByType } from './service';

interface ModalProps {
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, initValues } = props;

  const [initStates] = useState({
    orgFundCode: '',
    orgFundName: '',
    vogName: '',
    vogSubType: '',
    dcFundAbbr: '',
  });

  const [subType, setSubType] = useState([]);

  useEffect(() => {
    if (visible) {
      if (Object.keys(initValues).length >= 0) {
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

  useEffect(() => {
    getDictInfoByType({
      dictType: 'fund_vog_sub_type',
      parentKey: initValues.vogType,
    }).then((res) => {
      setSubType(res);
    });
  }, [initValues.vogType]);

  const handleSubmit = useCallback(
    async (value) => {
      const { success, errorMsg } = await setFundVogType({
        fundCode: initValues.orgFundCode,
        vogSubType: value.vogSubType,
        dcFundAbbr: value.dcFundAbbr,
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
      title="产品二级考核类型配置"
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText name="orgFundCode" label="产品编码" rules={[{ required: true }]} disabled />
      <ProFormText name="orgFundName" label="产品名称" rules={[{ required: true }]} disabled />
      <ProFormText name="vogName" label="vog一级考核类型" rules={[{ required: true }]} disabled />
      <ProFormText name="dcFundAbbr" label="产品简称" />
      {initValues.fundRaisingType == 0 ? (
        <ProFormSelect
          name="vogSubType"
          label="vog二级考核类型"
          options={subType}
          placeholder="请选择二级考核类型"
          rules={[{ required: true }]}
        />
      ) : null}
    </ModalForm>
  );
};

export default memo(DetailModal);
