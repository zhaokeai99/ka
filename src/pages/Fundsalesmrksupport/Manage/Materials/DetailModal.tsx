import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormSelect,
} from '@ant-design/pro-form';
import { stringToNumber, transOptions } from '@/utils/utils';
import {
  addMaterials,
  updateMaterials,
  queryDivisionManager,
  querySeasonByDivisionId,
  querySeasons,
} from './service';
import type { TableListItem } from './service';
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
    id: '',
    state: '',
    staticOrder: '',
    seasonId: '',
    divisionId: '',
    title: '',
    titleColour: '',
    mainContent: '',
    mainContentColour: '',
    content: '',
    contentColour: '',
    backgroundPicture: '',
    skipUrl: '',
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
        result = await addMaterials({
          ...value,
          // mainContentColour: value.mainContentColour || '#5B0D09',
          // contentColour: value.contentColour || '#5B0D09',
          // titleColour: value.titleColour || '#5B0D09',
        });
      } else {
        result = await updateMaterials({
          ...value,
          // mainContentColour: value.mainContentColour || '#5B0D09',
          // contentColour: value.contentColour || '#5B0D09',
          // titleColour: value.titleColour || '#5B0D09',
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
        label="主键id"
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
        name="title"
        label="主题"
        placeholder="请输入主题名称"
        fieldProps={{
          showCount: true,
          maxLength: 50,
        }}
      />
      <ProFormText
        name="titleColour"
        label="主题文字色号"
        placeholder="请输入主题文字色号"
        fieldProps={{
          showCount: true,
          maxLength: 20,
        }}
      />
      <MrkUploadItem
        required
        accept=".jpg, .jpeg, .png"
        name="backgroundPicture"
        label="背景图"
        formRef={formRef}
        placeholder="请输入背景图"
      />
      <ProFormText
        required
        name="skipUrl"
        label="跳转地址"
        placeholder="请输入跳转地址"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 200,
        }}
      />
      <ProFormText
        name="mainContent"
        label="主要简介"
        placeholder="请输入主要简介"
        fieldProps={{
          showCount: true,
          maxLength: 200,
        }}
      />
      <ProFormText
        name="mainContentColour"
        label="主要简介文字色号"
        placeholder="请输入主要简介文字色号"
        fieldProps={{
          showCount: true,
          maxLength: 20,
        }}
      />
      <ProFormText
        name="content"
        label="简介"
        placeholder="请输入简介"
        fieldProps={{
          showCount: true,
          maxLength: 100,
        }}
      />
      <ProFormText
        name="contentColour"
        label="简介文字色号"
        placeholder="请输入简介文字色号"
        fieldProps={{
          showCount: true,
          maxLength: 20,
        }}
      />
      <ProFormDigit
        required
        name="staticOrder"
        rules={[{ required: true }]}
        label="排序"
        fieldProps={{ precision: 0 }}
        min={0}
        max={10000}
        // hidden={modalType === 'edit'}
        placeholder="请输入排序值"
      />

      <ProFormRadio.Group
        required
        // hidden={modalType === 'edit'}
        rules={[{ required: true }]}
        name="state"
        label="状态"
        options={[
          {
            label: '可用',
            value: '0',
          },
          {
            label: '不可用',
            value: '1',
          },
        ]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
