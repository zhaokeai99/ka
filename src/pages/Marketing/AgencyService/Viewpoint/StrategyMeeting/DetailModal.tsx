import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormTextArea,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormDependency,
} from '@ant-design/pro-form';
import { stringToNumber } from '@/utils/utils';
import { addStrategyMeeting, updateStrategyMeeting, getTypeList } from './service';
import UploadItem from '@/components/UploadItem';

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
    meetingType: '',
    title: '',
    summary: '',
    meetingInfoUrl: '',
    meetingDate: null,
  });

  useEffect(() => {
    if (props.visible) {
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          if (key === 'meetingType') {
            formValues[key] = stringToNumber(props.initValues[key]);
          } else {
            formValues[key] = props.initValues[key] || '';
          }
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
        result = await addStrategyMeeting(value);
      } else {
        result = await updateStrategyMeeting({
          ...value,
          meetingId: props.initValues.meetingId,
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
      <div>
        <p style={{ color: 'red', fontSize: 12 }}>
          配置提示：
          <br />
          ①未召开的策略会，类型请选择「固收+预约」或「大类资产配置预约」。
          <br />
          ②已召开的策略会，类型请选择「固收+」或「大类资产配置」。
        </p>
      </div>
      <ProFormSelect
        name="meetingType"
        label="类型"
        request={async () => {
          return await getTypeList();
        }}
        placeholder="请选择类型"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="title"
        label="标题"
        fieldProps={{
          showCount: true,
          maxLength: 128,
        }}
        placeholder="请输入策略会信息标题,建议不超过10个字"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="summary"
        label="摘要"
        fieldProps={{
          showCount: true,
          maxLength: 30,
        }}
        placeholder="请输入策略会信息摘要，最多输入30个字"
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['meetingType']}>
        {({ meetingType }) => {
          if (meetingType != 2 && meetingType != 3) {
            return (
              <UploadItem
                placeholder="请上传策略会PDF"
                required
                accept=".pdf"
                name="meetingInfoUrl"
                label="策略会信息url"
                formRef={formRef}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDateTimePicker name="meetingDate" label="时间" rules={[{ required: true }]} />
    </ModalForm>
  );
};

export default memo(DetailModal);
