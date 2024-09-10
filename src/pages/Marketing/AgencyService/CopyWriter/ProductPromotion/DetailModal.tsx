import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect, ProFormDateTimePicker } from '@ant-design/pro-form';
import { stringToNumber } from '@/utils/utils';
import UploadItem from '@/components/UploadItem';
import { getTypeList, addProductRecommend, updateProductRecommend } from './service';
import type { TableListItem } from './service';

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
    fundCode: '',
    fundName: '',
    vogType: '',
    pptUrl: '',
    pdfUrl: '',
    materialPackageUrl: '',
    tag: '',
    showType: '',
    publishDate: null,
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
        result = await addProductRecommend(value);
      } else {
        result = await updateProductRecommend({
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
      <div>
        <p style={{ color: 'red', fontSize: 12 }}>
          配置提示：
          <br />
          请优先配置物料包地址，如无物料包地址再上传PPT、PDF。
          <br />
          标签最多配置2个，单个标签不超过6个字，两个标签之间用英文半角逗号分隔。
        </p>
      </div>
      <ProFormText
        required
        name="fundCode"
        label="基金代码"
        placeholder="请输入基金代码"
        rules={[{ required: true }]}
        readonly={modalType === 'edit'}
      />
      <ProFormText
        required
        name="fundName"
        label="基金名称"
        placeholder="请输入基金名称"
        rules={[{ required: true }]}
        readonly={modalType === 'edit'}
      />
      <ProFormSelect
        name="vogType"
        label="产品类型"
        request={async () => {
          return await getTypeList();
        }}
        placeholder="请选择产品类型"
        rules={[{ required: true }]}
      />
      <UploadItem name="pptUrl" label="PPT链接" formRef={formRef} />
      <UploadItem name="pdfUrl" label="PDF链接" formRef={formRef} />
      <ProFormText
        name="materialPackageUrl"
        label="物料包地址"
        placeholder="请输入物料包地址，物料包可通过H5生成器制作"
      />
      <ProFormText
        required
        name="tag"
        label="标签"
        placeholder="标签A,标签B"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="showType"
        label="是否重点推"
        placeholder="请选择是否重点推"
        rules={[{ required: true }]}
        valueEnum={{
          '0': '是',
          '1': '否',
        }}
      />
      <ProFormDateTimePicker
        width="100%"
        name="publishDate"
        label="发布时间"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
