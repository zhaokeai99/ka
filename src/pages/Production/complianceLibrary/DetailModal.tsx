import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormRadio,
  ProFormDependency,
  ProFormText,
} from '@ant-design/pro-form';
import { getTypeList, createComPlianceLibraryData, updateComPlianceLibraryData } from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

const typeMap = {
  add: '新增',
  check: '查看',
  edit: '编辑',
};
// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType } = props;
  const initStates = {
    content: '',
    contentStatus: '',
    impactType: '',
    libraryType: '',
  };

  useEffect(() => {
    if (props.visible)
      if (Object.keys(props.initValues).length) {
        formRef.current?.setFieldsValue({
          ...props.initValues,
          booth: {
            value: props.initValues.boothId,
            label: props.initValues.boothName,
          },
        });
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
  }, [props]);

  const handleSubmit = async (value: any) => {
    let result: any = {};
    const param =
      value.libraryType == '展位提示类型'
        ? {
            ...value,
            boothId: value.booth.value,
            boothName: value.booth.label,
          }
        : {
            ...value,
          };

    if (props.modalType === 'add') {
      result = await createComPlianceLibraryData(param);
    } else {
      result = await updateComPlianceLibraryData({
        ...param,
        id: props.initValues.id,
      });
    }
    if (result.success) {
      props.onClose('reload');
      return;
    }
    message.error(result.errorMsg || '接口请求失败');
  };

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title={typeMap[modalType]}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
      }}
      onFinish={handleSubmit}
      // @ts-ignore
      submitter={modalType === 'check' ? false : true}
    >
      <ProFormSelect
        readonly={modalType === 'check' ? true : false}
        name="libraryType"
        label="文库类型"
        request={async () => {
          const { libraryTypeList } = await getTypeList();
          if (Array.isArray(libraryTypeList)) {
            return libraryTypeList.map((item) => ({
              label: item,
              value: item,
            }));
          }
          return libraryTypeList;
        }}
        placeholder="请选择文库类型"
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['libraryType']}>
        {({ libraryType }) => {
          if (libraryType === '展位提示类型') {
            return (
              <ProFormSelect
                readonly={modalType === 'check' ? true : false}
                fieldProps={{
                  labelInValue: true,
                }}
                name="booth"
                label="展位id"
                request={async () => {
                  const { boothInfos } = await getTypeList();
                  if (Array.isArray(boothInfos)) {
                    return boothInfos.map((item) => ({
                      label: item.showLabel,
                      value: item.showId,
                    }));
                  }
                  return boothInfos;
                }}
                placeholder="请选择展位"
                rules={[{ required: true }]}
              />
            );
          }
          return (
            <ProFormSelect
              readonly={modalType === 'check' ? true : false}
              name="impactType"
              label="影响类型"
              request={async () => {
                const { impactTypeList } = await getTypeList();
                if (Array.isArray(impactTypeList)) {
                  return impactTypeList.map((item) => ({
                    label: item,
                    value: item,
                  }));
                }
                return impactTypeList;
              }}
              placeholder="请选择影响类型"
              rules={[{ required: true }]}
            />
          );
        }}
      </ProFormDependency>
      <ProFormTextArea
        readonly={modalType === 'check' ? true : false}
        required
        name="content"
        label="文案"
        placeholder="请输入文案"
        rules={[{ required: true }]}
      />
      {modalType === 'check' && <ProFormText readonly name="createUser" label="维护人" />}
      {modalType === 'check' && <ProFormText readonly name="updateTime" label="维护状态" />}
      <ProFormRadio.Group
        readonly={modalType === 'check' ? true : false}
        name="contentStatus"
        label="状态"
        rules={[{ required: true }]}
        options={[
          {
            label: '启用',
            value: 0,
          },
          {
            label: '失效',
            value: 1,
          },
        ]}
      />
    </ModalForm>
  );
};

export default DetailModal;
