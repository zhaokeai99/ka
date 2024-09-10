import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { addFundManager, updateFundManager } from './service';

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
    divisionId: '',
    divisionName: '',
    sortNum: '',
    state: '',
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
        result = await addFundManager({
          ...value,
          state: value.state || 1,
        });
      } else {
        result = await updateFundManager({
          ...value,
          divisionId: props.initValues.divisionId,
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
        onCancel: () => props.onClose('cancel'),
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="divisionName"
        label="赛区名称"
        placeholder="请输入赛区名称,最多30个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 30,
        }}
      />
      <ProFormDigit
        name="sortNum"
        label="赛区排序"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true }]}
        min={1}
        max={10000}
        placeholder="请输入排序值（非零的正整数）"
      />

      {/*<FormItem*/}
      {/*  name="sortNum"*/}
      {/*  label={'赛区排序'}*/}
      {/*  rules={[{ required: false, message: '请输入排序值（非零的正整数）' }]}*/}
      {/*>*/}
      {/*  <InputNumber min={1} />*/}
      {/*</FormItem>*/}

      <ProFormRadio.Group
        name="state"
        label="赛区状态"
        hidden={modalType === 'add'}
        options={[
          {
            label: '开启',
            value: 1,
          },
          {
            label: '关闭',
            value: 2,
          },
        ]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
