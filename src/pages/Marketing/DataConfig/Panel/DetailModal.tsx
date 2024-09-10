import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import { ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { setFundPanelShowType, getDictInfoByType } from './service';

interface ModalProps {
  visible: boolean;
  initValues?: any;
  fundcodes: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, fundcodes } = props;
  const [initStates] = useState({
    orgFundCode: '',
    orgFundName: '',
    panelShowType: '',
    panelShowName: '',
    dcFundAbbr: '',
    fundcodes: '',
  });

  useEffect(() => {
    formRef.current?.setFieldsValue({ panelShowType: props.initValues.panelShowName });
    formRef.current?.setFieldsValue({ FundCode: fundcodes.toString() });
  }, [props.fundcodes, props.initValues]);
  // },[props.initValues.panelShowType])

  const handleSubmit = useCallback(
    async (value) => {
      const { success, errorMsg } = await setFundPanelShowType({
        fundCode: fundcodes.toString(),
        panelShowType: value.panelShowType,
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
      title="大盘显示类型配置"
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText id="FundCode" name="FundCode" label="基金代码" disabled />

      <ProFormSelect
        id="panelShowType"
        name="panelShowType"
        label="大盘显示类型"
        request={async () => {
          return await getDictInfoByType({ dictType: 'panel_show_type' });
        }}
        placeholder="请选择大盘显示类型"
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
