import React, { memo, useCallback, useEffect } from 'react';
import { Form, Input, message, Modal, Select, Button } from 'antd';
import {
  EsAddIntegrationSource,
  EsEditIntegrationSource,
  EsTestConn,
} from '@/pages/Investment/BackEndManagement/DataSourceManagement/service';

const { Option } = Select;

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const IntegrationSourcMoadl = (props: ModalProps) => {
  const { visible, modalType } = props;
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [connectStatus, setConnectStatus] = React.useState(0);

  useEffect(() => {
    if (props.visible && props.modalType === 'edit') {
      // 如果是编辑操作,回显数据
      form.setFieldsValue(props.initValues);
      if (props.initValues?.connectStatus) {
        setConnectStatus(props.initValues.connectStatus);
      }
    }
  }, [props]);

  const handleOk = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    let result: any;
    values.connectStatus = connectStatus;
    if (props.modalType === 'add') {
      result = await EsAddIntegrationSource(values);
    } else {
      result = await EsEditIntegrationSource(values);
    }

    if (result.success) {
      props.onClose('reload');
      setConfirmLoading(false);
      return;
    }
    message.error(result.errorMsg || '接口请求失败');

    setConfirmLoading(false);
  }, [props]);

  const onSourceChange = (value: string) => {
    switch (value) {
      case 'MYSQL':
        form.setFieldsValue({ jdbcUrl: 'jdbc:mysql://' });
        return;
      case 'ORACLE':
        form.setFieldsValue({ jdbcUrl: 'jdbc:oracle:thin:@' });
        return;
    }
  };

  const onTest = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);

    const result = await EsTestConn(values);
    if (result === 1) {
      message.success('数据源连接成功！');
      setConnectStatus(1);
    } else {
      message.error('数据源连接失败！');
      setConnectStatus(2);
    }

    setConfirmLoading(false);
  }, [props]);

  const handleCancel = () => {
    props.onClose('cancel');
  };

  return (
    <>
      <Modal
        title={modalType === 'add' ? '新建数据源' : '修改数据源'}
        visible={visible}
        maskClosable={false}
        destroyOnClose={true}
        width={'40%'}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form {...formLayout} form={form} preserve={false}>
          <Form.Item name="id" label={'ID'} hidden={true}>
            <Input placeholder={'请输入ID'} />
          </Form.Item>
          <Form.Item
            name="sourceType"
            label={'数据源类型'}
            rules={[{ required: true, message: '数据源类型为必选项' }]}
          >
            <Select placeholder="请选择数据源类型类型" showSearch={true} onChange={onSourceChange}>
              <Option value={'MYSQL'}>mysql</Option>
              <Option value={'ORACLE'}>oracle</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="sourceName"
            label={'数据源名称'}
            rules={[{ required: true, message: '数据源名称为必填项' }]}
          >
            <Input placeholder={'请输入数据源名称'} />
          </Form.Item>
          <Form.Item
            name="sourceDesc"
            label={'数据源描述'}
            rules={[{ required: true, message: '数据源描述为必选项' }]}
          >
            <Input placeholder={'请输入数据源描述'} />
          </Form.Item>
          <Form.Item
            name="jdbcUrl"
            label={'jdbcUrl'}
            rules={[{ required: true, message: 'jdbcUrl为必填项' }]}
          >
            <Input placeholder={'请输入jdbcUrl名称'} />
          </Form.Item>
          <Form.Item
            name="userName"
            label={'用户名'}
            rules={[{ required: true, message: '用户名为必填项' }]}
          >
            <Input placeholder={'请输入用户名'} />
          </Form.Item>
          <Form.Item
            name="password"
            label={'密码'}
            rules={[{ required: true, message: '密码为必填项' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="link" htmlType="button" onClick={onTest} style={{ float: 'right' }}>
              test connection
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(IntegrationSourcMoadl);
