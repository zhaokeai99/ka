import React, { memo, useCallback, useEffect } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import {
  IndustryTemplateInfoFacadeAddTemplateInfo,
  IndustryTemplateInfoFacadeEditTemplateInfo,
} from '../service';

const { TextArea } = Input;

interface ModalProps {
  visible?: boolean;
  onClose?: (val: string) => void;
  dic?: any;
  saveData?: any;
  templateInfo: any;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const AddView = (props: ModalProps) => {
  const { visible, saveData, onClose, templateInfo } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const handleOk = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    const params = values;
    params.dataJson = JSON.stringify(saveData);
    params.industryId = '';
    params.industryName = '';
    params.frequency = '';
    params.isUsed = 0;
    if (!params?.remark) {
      params.remark = '';
    }
    params.id = templateInfo?.id;

    let result;
    if (params.id) {
      result = await IndustryTemplateInfoFacadeEditTemplateInfo(params);
    } else {
      result = await IndustryTemplateInfoFacadeAddTemplateInfo(params);
    }

    if (result.success && result.data > 0) {
      onClose?.('saved');
      setConfirmLoading(false);
      message.success('新增成功');
      return;
    }
    message.error(result.errorMsg || '接口请求失败');

    setConfirmLoading(false);
  }, [props]);

  const saveAs = useCallback(async () => {
    const values = await form?.validateFields();
    setConfirmLoading(true);
    const params = values;
    params.dataJson = JSON.stringify(saveData);
    params.industryId = '';
    params.industryName = '';
    params.frequency = '';
    params.isUsed = 0;
    if (!params?.remark) {
      params.remark = '';
    }

    const result = await IndustryTemplateInfoFacadeAddTemplateInfo(params);

    if (result.success && result.data > 0) {
      onClose?.('saved');
      setConfirmLoading(false);
      message.success('新增成功');
      return;
    }
    message.error(result.errorMsg || '接口请求失败');

    setConfirmLoading(false);
  }, [props]);

  const handleCancel = () => {
    onClose?.('cancel');
  };

  useEffect(() => {
    if (visible && templateInfo) {
      form.setFieldsValue({ templateName: templateInfo.templateName, remark: templateInfo.remark });
    }
  }, [templateInfo, visible]);

  return (
    <>
      <Modal
        title={'模版保存'}
        visible={visible}
        maskClosable={false}
        width={600}
        destroyOnClose={true}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button
            key="saveAs"
            type={'primary'}
            onClick={saveAs}
            style={templateInfo ? undefined : { display: 'none' }}
          >
            另存为
          </Button>,

          <Button key="save" type={'primary'} onClick={handleOk}>
            保存
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
        ]}
      >
        <Form {...formLayout} form={form} preserve={false}>
          <Form.Item
            name="templateName"
            label={'模板名称'}
            rules={[{ required: true, message: '模板名称为必填项' }]}
          >
            <Input placeholder={'请输入模板名称'} maxLength={50} />
          </Form.Item>
          <Form.Item name="remark" label={'描述'}>
            <TextArea rows={4} maxLength={2000} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(AddView);
