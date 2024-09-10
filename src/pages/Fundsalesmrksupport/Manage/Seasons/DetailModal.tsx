import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Form, InputNumber, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-form';
import { stringToNumber, transOptions } from '@/utils/utils';
import { addSeasons, updateSeasons, queryDivisionManager } from './service';
import type { TableListItem } from './service';
import moment from 'moment';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

const FormItem = Form.Item;

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType } = props;
  const [initStates] = useState<TableListItem>({
    state: '',
    seasonId: '',
    seasonName: '',
    divisionId: '',
    startDate: null,
    endDate: null,
    experienceAmount: '',
    channelId: '',
    activityId: '',
    gmtCreate: '',
    gmtModified: '',
  });

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
        result = await addSeasons({
          ...value,
          startDate: moment(value.startDate).format('yyyyMMDD'),
          endDate: moment(value.endDate).format('yyyyMMDD'),
          state: value.state || 0,
        });
      } else {
        const { seasonId } = props.initValues;
        result = await updateSeasons({
          ...value,
          seasonId,
          startDate: moment(value.startDate).format('yyyyMMDD'),
          endDate: moment(value.endDate).format('yyyyMMDD'),
          state: value.state || 0,
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
      <ProFormSelect
        name="divisionId"
        label="赛区名称"
        request={async () => {
          const divisionVar = await queryDivisionManager({});
          return transOptions(divisionVar, 'divisionName', 'divisionId', false);
        }}
        placeholder="请选择赛区名称"
        showSearch
        disabled={modalType === 'edit'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="seasonId"
        label="赛季ID"
        placeholder="请输入赛季ID"
        readonly={modalType === 'edit'}
        hidden={true}
      />
      <ProFormText
        required
        name="seasonName"
        label="赛季名称"
        placeholder="请输入赛季名称"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 30,
        }}
      />
      <FormItem
        name="experienceAmount"
        label={'体验金'}
        rules={[{ required: true, message: '请输入体验金（非零的正整数）' }]}
      >
        <InputNumber min={10} max={1000} addonAfter={'万元'} />
      </FormItem>
      <ProFormSelect
        name="channelId"
        label="渠道ID"
        placeholder="请选择渠道ID"
        rules={[{ required: true }]}
        options={[
          //  值可以从数据库动态查询，但是现在还没有后台接口，先写固定值后续修改
          {
            label: 'financial_challenge',
            value: 'financial_challenge',
          },
        ]}
      />
      <ProFormSelect
        name="activityId"
        label="活动ID"
        placeholder="请选择活动ID"
        rules={[{ required: true }]}
        options={[
          //  值可以从数据库动态查询，但是现在还没有后台接口，先写固定值后续修改
          {
            label: 'financial_challenge',
            value: 'financial_challenge',
          },
        ]}
      />
      {/*<ProFormText*/}
      {/*  required*/}
      {/*  name="channelId"*/}
      {/*  label="渠道ID"*/}
      {/*  placeholder="请输入渠道ID"*/}
      {/*  rules={[{ required: true }]}*/}
      {/*/>*/}
      {/*<ProFormText*/}
      {/*  required*/}
      {/*  name="activityId"*/}
      {/*  label="活动ID"*/}
      {/*  placeholder="请输入活动ID"*/}
      {/*  rules={[{ required: true }]}*/}
      {/*/>*/}
      <ProFormSelect
        name="state"
        label="赛季状态"
        placeholder="请选择赛季状态"
        options={[
          // 0：尚未启用 1：正常 2：已停用
          {
            label: '未开启',
            value: '',
          },
          {
            label: '已开启',
            value: 1,
          },
          {
            label: '已结束',
            value: 2,
          },
        ]}
      />
      <ProFormDatePicker name="startDate" label="赛季开始日期" rules={[{ required: true }]} />
      <ProFormDatePicker name="endDate" label="赛季结束日期" rules={[{ required: true }]} />
    </ModalForm>
  );
};

export default memo(DetailModal);
