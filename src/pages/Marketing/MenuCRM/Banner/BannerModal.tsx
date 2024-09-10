import ProForm, {
  ModalForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-form';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import UploadImg from '../../HonorHall/UploadImg';
import { addScStaticResource, updateScStaticResource } from '../service';

type PropsType = {
  type: string;
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
};

const BannerModal = (props: PropsType) => {
  const { type, visible, onClose, initValues } = props;
  const formRef = useRef<ProFormInstance>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [initStatus] = useState({
    pictureDesc: '',
    pageStaticPath: '',
    pictureOrder: null,
    skipUrl: '',
  });

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
      res = await addScStaticResource({ ...values });
    } else {
      res = await updateScStaticResource({ ...values, id: initValues?.id });
    }

    if (res?.success) {
      message.success('Banner配置成功！');
      onClose('RELOAD');
    }
  };

  return (
    <ModalForm
      formRef={formRef}
      title={type === 'ADD' ? '新增Banner' : '编辑Banner'}
      visible={visible}
      initialValues={initStatus}
      labelCol={{ span: 4 }}
      layout="horizontal"
      modalProps={{
        onCancel: () => onClose('CLOSE'),
        afterClose: () => {
          setFileList([]);
        },
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        label="Banner名称"
        name="pictureDesc"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 15,
        }}
        placeholder="最多输入15个字符"
      />
      <ProForm.Item label="上传图片" required>
        <UploadImg
          label=""
          required
          name="pageStaticPath"
          formRef={formRef}
          tipMessage="请上传Banner图片"
          fileList={fileList}
          setFileList={setFileList}
        />
        <span style={{ color: 'red' }}>注：尺寸为750*320的图片显示效果更好哦~</span>
      </ProForm.Item>
      <ProFormDigit
        label="Banner顺序"
        name="pictureOrder"
        fieldProps={{
          min: 1,
          precision: 0,
        }}
      />
      <ProFormText label="跳转链接" name="skipUrl" />
    </ModalForm>
  );
};

export default BannerModal;
