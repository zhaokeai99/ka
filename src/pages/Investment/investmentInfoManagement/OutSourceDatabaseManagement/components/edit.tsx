import React, { memo, useCallback, useEffect } from 'react';
import { DatePicker, Form, Input, message, Modal } from 'antd';
import { IrOutsourceFacadeUpdateIrOutsourceList, TableListItem } from '../service';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface ModalProps {
  visible: boolean;
  onClose: (val?: string) => void;
  data: TableListItem;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const Edit = (props: ModalProps) => {
  const { visible, data } = props;
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = React.useState(false);

  useEffect(() => {
    form.setFieldsValue({ ...data, time: [data?.beginDate, data?.endDate] });
  }, [data]);

  const handleOk = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    const params = values;
    params.status = 0;

    if (values.time) {
      params.beginDateStr = values.time[0].format('YYYY-MM-DD');
      params.endDateStr = values.time[1].add(1, 'days').format('YYYY-MM-DD');
    }

    const result = await IrOutsourceFacadeUpdateIrOutsourceList(params);

    if (result.success && result.data > 0) {
      props.onClose('reload');
      setConfirmLoading(false);
      message.success('修改成功');
      return;
    }
    message.error(result.errorMsg || '保存失败');

    setConfirmLoading(false);
  }, [props]);

  const handleCancel = () => {
    props.onClose('cancel');
  };

  return (
    <>
      <Modal
        title={'修改'}
        visible={visible}
        maskClosable={false}
        width={600}
        destroyOnClose={true}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form {...formLayout} form={form} preserve={false}>
          <Form.Item name="id" hidden={true}>
            <Input type={'hidden'} />
          </Form.Item>
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
export default memo(Edit);
