import React, { memo, useCallback } from 'react';
import { DatePicker, Form, Input, message, Modal } from 'antd';
import { IrOutsourceFacadeInsertIrOutsourceList } from '../service';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface ModalProps {
  visible: boolean;
  onClose: (val?: string) => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const Add = (props: ModalProps) => {
  const { visible } = props;
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const handleOk = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    const params = values;
    params.status = 0;

    if (values.visiableDate) {
      params.beginDate = values.visiableDate[0].format('YYYY-MM-DD');
      params.endDate = values.visiableDate[1].add(1, 'days').format('YYYY-MM-DD');
    }

    const result = await IrOutsourceFacadeInsertIrOutsourceList(params);

    if (result.success && result.data > 0) {
      props.onClose('reload');
      setConfirmLoading(false);
      message.success('新增成功');
      return;
    }
    message.error(result.errorMsg || '接口请求失败');

    setConfirmLoading(false);
  }, [props]);

  const handleCancel = () => {
    props.onClose('cancel');
  };

  return (
    <>
      <Modal
        title={'新增'}
        visible={visible}
        maskClosable={false}
        width={600}
        destroyOnClose={true}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form {...formLayout} form={form} preserve={false}>
          <Form.Item
            name="bizName"
            label={'名称'}
            rules={[{ required: true, message: '名称为必填项' }]}
          >
            <Input placeholder={'请输入名称'} maxLength={200} />
          </Form.Item>
          <Form.Item
            name="bizUrl"
            label={'网址'}
            rules={[{ required: false, message: '网址为必填项' }]}
          >
            <Input placeholder={'请输入网址'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="bizType"
            label={'类型'}
            rules={[{ required: false, message: '类型为必填项' }]}
          >
            <Input placeholder={'请输入类型'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="bizTheme"
            label={'主题/行业'}
            rules={[{ required: false, message: '主题/行业为必填项' }]}
          >
            <Input placeholder={'请输入主题/行业'} maxLength={90} />
          </Form.Item>
          <Form.Item name="bizDesc" label={'描述'}>
            <TextArea rows={4} maxLength={2000} />
          </Form.Item>
          <Form.Item name="bizRemark" label={'备注'}>
            <TextArea rows={4} maxLength={2000} />
          </Form.Item>
          <Form.Item
            name="logo"
            label={'logo'}
            rules={[{ required: false, message: 'logo为必填项' }]}
          >
            <Input placeholder={'请输入logo'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="dep"
            label={'部门'}
            rules={[{ required: false, message: '部门为必填项' }]}
          >
            <Input placeholder={'请输入部门'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="visiableDate"
            label={'生效日期'}
            rules={[{ required: false, message: '生效日期为必填项' }]}
          >
            <RangePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(Add);
