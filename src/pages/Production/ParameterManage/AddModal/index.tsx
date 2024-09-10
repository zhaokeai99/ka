import { ModalForm, ProFormText, ProForm } from '@ant-design/pro-form';
import { Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { history } from 'umi';
import { getFundInfoByCode, createExample } from '../service';

const { Search } = Input;

export default (props: { visible: boolean; addClosedModal: any }) => {
  const { visible, addClosedModal } = props;

  const formRef = useRef<ProFormInstance>();
  // 新增接口需要的入参 fundId：基金编号  templateVersion：版本
  const [paramsValue, setParamsValue] = useState({
    fundId: '',
    templateVersion: '',
  });

  // 根据基金代码查询基金全称
  const onSearch = async (value: any) => {
    if (!value) {
      message.error('请输入基金代码');
      return;
    }
    const { fundName, id, templateVersion } = await getFundInfoByCode({ fundCode: value });
    formRef?.current?.setFieldsValue({ fundName });
    setParamsValue({
      templateVersion,
      fundId: id,
    });
  };

  // 新增
  const handleCreate = async (params: any) => {
    const { fundId } = paramsValue;
    const tempParams = {
      templateCode: 'o3Template',
      fundId,
      ...params,
    };
    const { success, data } = await createExample(tempParams);
    if (success) {
      addClosedModal();
      history.push(
        `parameterManage/detailFile/${data.fundId}/modify?templateVersion=${data.templateVersion} `,
      );
    }
  };

  return (
    <ModalForm
      title="新增"
      visible={visible}
      formRef={formRef}
      onFinish={handleCreate}
      layout={'horizontal'}
      labelCol={{ span: 4 }}
      modalProps={{
        onCancel: () => {
          addClosedModal();
        },
        destroyOnClose: true,
        okText: '保存',
      }}
    >
      <ProForm.Item
        name="fundCode"
        label="基金代码"
        rules={[{ required: true, message: '请输入基金代码' }]}
      >
        <Search
          placeholder="请输入基金代码查询基金全称"
          allowClear
          style={{ width: 500 }}
          onSearch={onSearch}
        />
      </ProForm.Item>
      <ProFormText
        name="fundName"
        label="基金全称"
        placeholder="通过基金代码查询基金全称"
        disabled
        fieldProps={{
          style: { width: 500 },
        }}
        rules={[{ required: true, message: '此基金已存在或已清盘不可新增' }]}
      />
      {/* <ProFormDatePicker
        name="approvalStartDate"
        label="预计成立日"
        fieldProps={{
          style: { width: 500 },
        }}
        rules={[{ required: true, message: '请选择预计成立日' }]}
      /> */}
    </ModalForm>
  );
};
