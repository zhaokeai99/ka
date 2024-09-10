import React, { useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import UploadItem from '@/components/UploadItem';
import {
  addPageIcon,
  updatePageIcon,
  queryPageIconTypeDesc,
  queryPageIconSkipTypeDesc,
} from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType, initValues } = props;

  useEffect(() => {
    if (visible) {
      if (modalType === 'edit' && Object.keys(initValues).length >= 0) {
        formRef.current?.setFieldsValue(initValues);
      }
    }
  }, [props]);

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      if (modalType === 'add') {
        result = await addPageIcon(value);
      } else {
        result = await updatePageIcon({
          ...value,
          id: initValues.id,
        });
      }
      if (result.success) {
        props.onClose('reload', value.pictureType);
        formRef.current?.resetFields();
        return;
      } else {
        message.error(result.errorMsg || '接口请求失败');
      }
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
      modalProps={{
        onCancel: () => {
          props.onClose('cancel');
          formRef.current?.resetFields();
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="pictureDesc"
        label="图片名称"
        placeholder="请输入图片名称"
        rules={[{ required: true }]}
      />
      <UploadItem
        required
        accept=".jpg, .jpeg, .png"
        name="pageStaticPath"
        label="图片地址链接"
        formRef={formRef}
      />
      <ProFormSelect
        name="pictureType"
        label="图片类型"
        disabled={modalType === 'edit'}
        request={async () => {
          return await queryPageIconTypeDesc();
        }}
        placeholder="请选择类型"
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['pictureType']}>
        {({ pictureType }) => {
          if (pictureType === 0) {
            return (
              <ProFormSelect
                name="hot"
                label="热点"
                placeholder="请选择"
                options={[
                  { label: '是', value: 1 },
                  { label: '否', value: 0 },
                ]}
              />
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormText
        name="skipUrl"
        label="图片跳转地址"
        placeholder="请输入图片跳转地址"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="skipUrlType"
        label="图片跳转类型"
        request={async () => {
          return await queryPageIconSkipTypeDesc();
        }}
        placeholder="请选择类型"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
