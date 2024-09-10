import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import {
  addCopyRules,
  updateCopyRules,
  queryDivisionManager,
  querySeasons,
  querySeasonByDivisionId,
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
    id: '',
    seasonId: '',
    seasonName: '',
    divisionId: '',
    type: '',
    title: '',
    content: '',
    gmtCreate: '',
    gmtModified: '',
    sort: '',
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
        result = await addCopyRules({
          ...value,
        });
      } else {
        result = await updateCopyRules({
          ...value,
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

  const [typeValue, setTypeValue] = useState<any>(undefined);
  const getType = useCallback(async (value) => {
    setTypeValue(value.target.value);
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
        label="主键id"
        placeholder="请输入主键id"
        hidden={true}
        readonly={modalType === 'edit'}
      />
      <ProFormRadio.Group
        required
        rules={[{ required: true }]}
        disabled={modalType === 'edit'}
        name="type"
        label="文案类型"
        options={[
          {
            label: '活动规则',
            value: '0',
          },
          {
            label: '交易规则',
            value: '1',
          },
          {
            label: '活动预告',
            value: '2',
          },
        ]}
        fieldProps={{
          onChange: (value) => {
            getType(value);
          },
        }}
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
        name="title"
        label="标题"
        placeholder="请输入标题,最多30个字符"
        fieldProps={{
          showCount: true,
          maxLength: 30,
        }}
        hidden={typeValue === '2' || props.initValues.type === '2'}
        rules={[{ required: typeValue !== '2' && props.initValues.type !== '2' }]}
      />
      <ProFormTextArea
        required
        name="content"
        label="内容"
        placeholder="请输入内容"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 2000,
        }}
        hidden={typeValue === '2'}
      />
      <ProFormTextArea
        name="content"
        label="内容"
        placeholder="请输入内容"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 200,
        }}
        hidden={typeValue !== '2'}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true }]}
        min={0}
        max={10000}
        placeholder="请输入排序值"
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
