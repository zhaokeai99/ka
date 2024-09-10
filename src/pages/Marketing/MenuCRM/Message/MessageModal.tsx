import {
  ModalForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { addScMessage, updateScMessage } from '../service';

type PropsType = {
  type: string;
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
};

const MessageModal = (props: PropsType) => {
  const { type, visible, onClose, initValues } = props;
  const formRef = useRef<ProFormInstance>();
  const [initStatus] = useState({
    messageName: '',
    messageInfo: '',
    skipUrl: '',
    sort: null,
  });

  useEffect(() => {
    if (type === 'EDIT') {
      formRef.current?.setFieldsValue({ ...initValues });
    } else {
      formRef.current?.setFieldsValue({ ...initStatus });
    }
  }, [visible, type, initValues]);

  // 提交
  const handleSubmit = async (values: any) => {
    let res: any = {};
    if (type === 'ADD') {
      res = await addScMessage({ ...values });
    } else {
      res = await updateScMessage({ ...values, messageId: initValues?.messageId });
    }

    if (res?.success) {
      message.success('消息配置成功！');
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
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        label="消息标题"
        name="messageName"
        fieldProps={{
          showCount: true,
          maxLength: 50,
        }}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        label="消息内容"
        name="messageInfo"
        placeholder="最多输入200个字符"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 200,
        }}
      />
      <ProFormDigit
        label="消息顺序"
        name="sort"
        // rules={[{ required: true, message: '请输入消息顺序（数字类型）' }]}
        fieldProps={{
          min: 1,
          precision: 0,
        }}
      />
      <ProFormText label="跳转链接" name="skipUrl" />
    </ModalForm>
  );
};

export default MessageModal;
