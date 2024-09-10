import React, { memo, useCallback, useEffect } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import {
  MpBenchmarkAdd,
  MpBenchmarkEdit,
} from '@/pages/Investment/Simulation/MainBenchmark/service';

const { TextArea } = Input;
const { Option } = Select;

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  domainDic: [];
  onClose: (val?: string) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const MainBenchmarkMoadl = (props: ModalProps) => {
  const { visible, modalType, domainDic } = props;
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = React.useState(false);

  useEffect(() => {
    if (props.visible && props.modalType === 'edit') {
      // 如果是编辑操作,回显数据
      form.setFieldsValue(props.initValues);
    }
  }, [props]);

  const handleOk = useCallback(async () => {
    await form?.validateFields().then((values: any) => {
      setConfirmLoading(true);
      setTimeout(async () => {
        let result: any;
        if (props.modalType === 'add') {
          result = await MpBenchmarkAdd(values);
        } else {
          result = await MpBenchmarkEdit(values);
        }

        if (result.success) {
          props.onClose('reload');
          setConfirmLoading(false);
          return;
        }
        message.error(result.errorMsg || '接口请求失败');

        setConfirmLoading(false);
      }, 2000);
    });
  }, [props]);

  const handleCancel = () => {
    props.onClose('cancel');
  };

  return (
    <>
      <Modal
        title={modalType === 'add' ? '创建基准' : '编辑基准'}
        visible={visible}
        maskClosable={false}
        destroyOnClose={true}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form {...formLayout} form={form} preserve={false}>
          <Form.Item name="id" label={'ID'} hidden={true}>
            <Input placeholder={'请输入ID'} />
          </Form.Item>
          <Form.Item
            name="bmName"
            label={'基准名称'}
            rules={[{ required: true, message: '基准名称为必填项' }]}
          >
            <Input placeholder={'请输入基准名称'} />
          </Form.Item>
          <Form.Item
            name="bmType"
            label={'基准类型'}
            rules={[{ required: true, message: '基准类型为必选项' }]}
          >
            <Select placeholder="请选择基准类型" showSearch={true}>
              <Option value={1}>市场指数</Option>
              <Option value={2}>复合基准</Option>
              <Option value={3}>自定义基准</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="bmCode"
            label={'基准代码'}
            rules={[{ required: true, message: '基准代码为必填项' }]}
          >
            <Input placeholder={'请输入基准代码'} />
          </Form.Item>
          <Form.Item
            name="domain"
            label={'业务域'}
            rules={[{ required: true, message: '业务域为必选项' }]}
          >
            <Select placeholder="请选择业务域" showSearch={true}>
              {domainDic.map((val: any) => (
                <Option key={val?.value} value={val?.value}>
                  {val?.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="bmComment" label={'基准说明'}>
            <TextArea placeholder={'请输入备注'} rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(MainBenchmarkMoadl);
