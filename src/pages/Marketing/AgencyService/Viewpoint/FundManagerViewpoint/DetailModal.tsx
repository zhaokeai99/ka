import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormDependency,
} from '@ant-design/pro-form';
import {
  addFundManagerViewpoint,
  updateFundManagerViewpoint,
  queryFundManagerInfo,
  getTypeList,
} from './service';
import { stringToNumber } from '@/utils/utils';

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
    fundManagerId: '',
    vogType: '',
    title: '',
    summary: '',
    viewpointInfoUrl: '',
    viewDate: null,
    publishDate: null,
    fiveCycles: null,
  });
  const initDataFn = (value: any) => {
    if (value.vogType == '0') {
      const { macro, currency, mechanism, positions, mood } = value.fiveCycles;
      return {
        ...value,
        macro: macro || undefined,
        currency: currency || undefined,
        mechanism: mechanism || undefined,
        positions: positions || undefined,
        mood: mood || undefined,
      };
    }
    return value;
  };

  useEffect(() => {
    if (props.visible) {
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          if (key === 'vogType') {
            formValues[key] = stringToNumber(props.initValues[key]);
          } else {
            formValues[key] = props.initValues[key] || '';
          }
        });
        formRef.current?.setFieldsValue(initDataFn(formValues));
      } else {
        formRef.current?.setFieldsValue(initDataFn(initStates));
      }
    }
  }, [props]);

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      const params = {
        ...value,
        fiveCycles: {
          macro: value.macro,
          currency: value.currency,
          mechanism: value.mechanism,
          positions: value.positions,
          mood: value.mood,
        },
      };
      if (props.modalType === 'add') {
        result = await addFundManagerViewpoint(params);
      } else {
        result = await updateFundManagerViewpoint({
          ...params,
          viewPointId: props.initValues.viewPointId,
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
      title={modalType === 'add' ? '新增' : '编辑'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => {
          formRef.current?.resetFields();
          props.onClose('cancel');
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        name="fundManagerId"
        label="基金经理"
        request={async () => {
          return await queryFundManagerInfo();
        }}
        placeholder="请选择基金经理"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="vogType"
        label="观点类型"
        request={async () => {
          return await getTypeList();
        }}
        placeholder="请选择观点类型"
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['vogType']}>
        {({ vogType }) => {
          if (vogType === 0) {
            return (
              <ProFormText
                name="macro"
                label="宏观周期"
                placeholder="请输入周期类型"
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['vogType']}>
        {({ vogType }) => {
          if (vogType === 0) {
            return (
              <ProFormText
                name="currency"
                label="货币周期"
                placeholder="请输入周期类型"
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['vogType']}>
        {({ vogType }) => {
          if (vogType === 0) {
            return (
              <ProFormText
                name="mechanism"
                label="机构行为周期"
                placeholder="请输入周期类型"
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['vogType']}>
        {({ vogType }) => {
          if (vogType === 0) {
            return (
              <ProFormText
                name="positions"
                label="仓位周期"
                placeholder="请输入周期类型"
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['vogType']}>
        {({ vogType }) => {
          if (vogType === 0) {
            return (
              <ProFormText
                name="mood"
                label="情绪周期"
                placeholder="请输入周期类型"
                rules={[{ required: true }]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormTextArea
        name="title"
        label="标题"
        fieldProps={{
          showCount: true,
          maxLength: 40,
        }}
        placeholder="请输入基金经理观点标题,最多输入40个字"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="summary"
        label="摘要"
        fieldProps={{
          showCount: true,
          maxLength: 500,
        }}
        placeholder="请输入基金经理观点摘要,最多输入500个字"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="viewpointInfoUrl"
        label="观点链接"
        placeholder="请输入基金经理观点链接，观点链接可通过H5生成器制作"
        rules={[{ required: true }]}
      />
      <ProFormDateTimePicker name="viewDate" label="观点时间" rules={[{ required: true }]} />
      <ProFormDateTimePicker name="publishDate" label="发布时间" rules={[{ required: true }]} />
    </ModalForm>
  );
};

export default memo(DetailModal);
