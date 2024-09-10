import React, { memo, useEffect, useRef, useState } from 'react';
import { ModalForm, ProFormDigit, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import UploadImg from '../UploadImg';
import UploadItem from '@/components/UploadItem';
import { addPageIcon, updatePageIcon } from '../service';

type PropsType = {
  type: string;
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
};

const MarketingModal = (props: PropsType) => {
  const { type, visible, onClose, initValues } = props;
  const [initStatus] = useState({
    pictureDesc: '',
    pictureOrder: '',
    pageStaticPath: '',
    pptOrPdfUrl: '',
    skipUrl: '',
  });
  const [fileList, setFileList] = useState<any[]>([]);
  const formRef = useRef<ProFormInstance>();

  // 回显
  useEffect(() => {
    if (type === 'EDIT') {
      formRef.current?.setFieldsValue({ ...initValues });
      setFileList([{ uid: 1, url: initValues?.pageStaticPath }]);
    } else {
      formRef.current?.setFieldsValue({ ...initStatus });
    }
  }, [visible, type, initValues]);

  // 提交
  const handleSubmit = async (values: any) => {
    let res: any = {};
    if (type === 'ADD') {
      res = await addPageIcon(values);
    } else {
      res = await updatePageIcon({ ...values, id: initValues?.id });
    }

    if (res?.success) {
      message.success('营销配置成功！');
      onClose('RELOAD');
    }
  };

  return (
    <ModalForm
      formRef={formRef}
      title={type === 'ADD' ? '新增' : '编辑'}
      visible={visible}
      initialValues={initStatus}
      labelCol={{ span: 4 }}
      layout="horizontal"
      modalProps={{
        onCancel: () => onClose('CLOSE'),
        maskClosable: false,
        afterClose: () => {
          setFileList([]);
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        label="物料名称"
        name="pictureDesc"
        placeholder="最多输入15个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 15,
        }}
      />
      <ProFormDigit
        label="物料顺序"
        name="pictureOrder"
        rules={[{ required: true, message: '请输入物料顺序（数字类型）' }]}
        fieldProps={{
          min: 1,
          precision: 0,
        }}
      />
      <UploadImg
        required
        label="背景图片"
        name="pageStaticPath"
        formRef={formRef}
        tipMessage="请上传背景图片"
        fileList={fileList}
        setFileList={setFileList}
      />
      <UploadItem label="上传附件" name="pptOrPdfUrl" formRef={formRef} />
      <ProFormText label="跳转地址" name="skipUrl" />
    </ModalForm>
  );
};

export default memo(MarketingModal);
