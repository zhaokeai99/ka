import React, { memo, useCallback } from 'react';
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { SelmLiveRoadShowInfoFacadeAddLiveRoadShowInfo } from '../service';
import moment from 'moment';
import styles from '../index.less';

const { TextArea } = Input;

interface ModalProps {
  visible: boolean;
  onClose: (val?: string) => void;
  onShowMail: (val?: any) => void;
  dic: any;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const Add = (props: ModalProps) => {
  const { visible, onShowMail, dic } = props;
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const handleOk = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    const params = values;
    params.messageId = '0';
    params.status = 0;
    params.showTime = values.showTime.format('YYYY-MM-DD HH:mm');
    const result = await SelmLiveRoadShowInfoFacadeAddLiveRoadShowInfo(params);

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

  //邮件
  const handleMail = async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    const params = values;
    params.messageId = '0';
    params.status = 0;
    params.showTime = values.showTime.format('YYYY-MM-DD HH:mm');
    const result = await SelmLiveRoadShowInfoFacadeAddLiveRoadShowInfo(params);

    if (result.success && result.data > 0) {
      props.onClose('reload');
      setConfirmLoading(false);
      message.success('新增成功');
      onShowMail(result.data);
      return;
    }
    message.error(result.errorMsg || '接口请求失败');

    setConfirmLoading(false);
  };

  const getOptions = () => {
    const d = dic?.rooms?.map((itm: any) => {
      return { value: itm.name, label: itm.name };
    });
    return d;
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
        footer={
          <div style={{ width: '100%' }}>
            <div style={{ width: '50%', display: 'inline-block', textAlign: 'left' }}>
              <Button
                key="mail"
                loading={confirmLoading}
                className={styles['btnGreen']}
                onClick={() => handleMail()}
              >
                邮件
              </Button>
            </div>
            <div style={{ width: '50%', display: 'inline-block' }}>
              <Button key="back" loading={confirmLoading} onClick={() => handleCancel()}>
                关闭
              </Button>
              ,
              <Button
                key="confirm"
                loading={confirmLoading}
                type={'primary'}
                onClick={() => handleOk()}
              >
                确定
              </Button>
            </div>
          </div>
        }
      >
        <Form {...formLayout} form={form} preserve={false}>
          <Form.Item
            name="theme"
            label={'路演主题'}
            rules={[{ required: true, message: '路演主题为必填项' }]}
          >
            <Input placeholder={'请输入路演主题'} maxLength={200} />
          </Form.Item>
          <Form.Item
            name="showTime"
            label={'路演时间'}
            rules={[{ required: true, message: '路演时间为必填项' }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
            />
          </Form.Item>
          <Form.Item
            name="broker"
            label={'券商'}
            rules={[{ required: false, message: '券商为必填项' }]}
          >
            <Input placeholder={'请输入券商'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="industry"
            label={'行业'}
            rules={[{ required: false, message: '行业为必填项' }]}
          >
            <Input placeholder={'请输入行业'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="analyst"
            label={'分析师'}
            rules={[{ required: false, message: '分析师为必填项' }]}
          >
            <Input placeholder={'请输入分析师'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="contact"
            label={'联系人'}
            rules={[{ required: false, message: '联系人为必填项' }]}
          >
            <Input placeholder={'请输入联系人'} maxLength={90} />
          </Form.Item>
          <Form.Item
            name="addr"
            label={'会议室'}
            rules={[{ required: false, message: '会议室为必填项' }]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={getOptions()}
            />
          </Form.Item>
          <Form.Item name="content" label={'路演信息'}>
            <TextArea rows={4} maxLength={2000} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(Add);
