import React, { memo, useEffect, useRef, useState } from 'react';
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { addHonorAwards, queryAwardsTypeDesc, updateHonorAwards } from '../service';
import { message } from 'antd';

type PropsType = {
  type: string;
  visible: boolean;
  initValues?: any;
  onClose: (val?: string) => void;
};

const PrizesModal = (props: PropsType) => {
  const { type, visible, onClose, initValues } = props;
  const [initStatus] = useState({
    awardsName: '',
    awardsType: '',
  });
  const formRef = useRef<ProFormInstance>();

  // 回显
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
      res = await addHonorAwards(values);
    } else {
      res = await updateHonorAwards({ ...values, awardsId: initValues.awardsId });
    }

    if (res?.success) {
      message.success('奖项配置成功！');
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
        label="奖项名称"
        name="awardsName"
        rules={[{ required: true }]}
        fieldProps={{
          showCount: true,
          maxLength: 15,
        }}
        placeholder="最多输入15个字符"
      />
      <ProFormSelect
        label="奖项标签"
        placeholder="请选择奖项标签"
        name="awardsType"
        rules={[{ required: true }]}
        request={async () => await queryAwardsTypeDesc()}
      />
    </ModalForm>
  );
};

export default memo(PrizesModal);
