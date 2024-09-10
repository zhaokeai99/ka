import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { stringToNumber, transOptions } from '@/utils/utils';
import {
  addPrizeConfig,
  updatePrizeConfig,
  queryDivisionManager,
  querySeasonByDivisionId,
  querySeasons,
} from './service';
import type { TableListItem } from './service';
import moment from 'moment';
import MrkUploadItem from '@/components/MrkUploadItem';

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
  const [initStates] = useState<TableListItem>({
    divisionId: '',
    seasonId: '',
    receiveWay: '',
    startTime: null,
    endTime: null,
    receiveMembers: '',
    prizeLevel: '',
    prizeName: '',
    imageUrl: '',
    gmtCreate: '',
    gmtModified: '',
    id: '',
    infoId: '',
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
        result = await addPrizeConfig({
          ...value,
          startTime: moment(value.startTime).format('yyyy-MM-DD HH:mm:ss'),
          endTime: moment(value.endTime).format('yyyy-MM-DD HH:mm:ss'),
          prizeLevel: value.prizeLevel || '0',
        });
      } else {
        // const { seasonId } = props.initValues;
        result = await updatePrizeConfig({
          ...value,
          startTime: moment(value.startTime).format('yyyy-MM-DD HH:mm:ss'),
          endTime: moment(value.endTime).format('yyyy-MM-DD HH:mm:ss'),
          prizeLevel: value.prizeLevel || '0',
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

  const [orgSubData, setOrgSubData] = useState<any>(undefined);
  const getSeasonByDivisionId = useCallback(async (value) => {
    const result = await querySeasonByDivisionId({
      ...value,
      divisionId: value,
    });
    setOrgSubData(transOptions(result, 'seasonName', 'seasonId', false));
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
      <ProFormText
        required
        name="id"
        label="base主键id"
        placeholder="请输入主键id"
        hidden={true}
        readonly={modalType === 'edit'}
      />
      <ProFormText
        required
        name="infoId"
        label="info主键id"
        placeholder="请输入主键id"
        hidden={true}
        readonly={modalType === 'edit'}
      />
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
            formRef?.current?.setFieldsValue({ seasonId: '' });
            getSeasonByDivisionId(value);
          },
        }}
        disabled={modalType === 'edit'}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="seasonId"
        label="赛季名称"
        showSearch
        options={orgSubData}
        disabled={modalType === 'edit'}
        hidden={modalType === 'edit'}
        rules={[{ required: true }]}
        placeholder="请选择赛季名称"
      />
      <ProFormSelect
        name="seasonId"
        label="赛季名称"
        request={async () => {
          const seasonVar = await querySeasons({});
          return transOptions(seasonVar, 'seasonName', 'seasonId', false);
        }}
        placeholder="请选择赛季名称"
        showSearch
        // fieldProps = {{filterOption : (input, option) =>
        //         option?.label?.indexOf(input) !== -1
        // }}
        disabled={modalType === 'edit'}
        hidden={modalType === 'add'}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="prizeName"
        label="奖品名称"
        placeholder="请输入奖品名称,最多6个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 6,
        }}
      />
      <MrkUploadItem
        required
        accept=".jpg, .jpeg, .png"
        name="imageUrl"
        label="奖品图片"
        formRef={formRef}
        placeholder="请上传奖品图片"
      />
      <ProFormDigit
        name="receiveMembers"
        label="获奖人数"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true }]}
        min={1}
        max={10000}
        placeholder="请输入获奖人数（非零的正整数）"
      />
      <ProFormTextArea
        name="receiveWay"
        label="领取方式"
        placeholder="请输入领取方式"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 200,
        }}
      />
      <ProFormDateTimePicker name="startTime" label="开奖开始日期" rules={[{ required: true }]} />
      <ProFormDateTimePicker name="endTime" label="开奖结束日期" rules={[{ required: true }]} />
    </ModalForm>
  );
};

export default memo(DetailModal);
