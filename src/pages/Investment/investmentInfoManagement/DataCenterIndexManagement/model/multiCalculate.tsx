import React, { memo, useCallback } from 'react';
import { Form, Input, message, Row, Col, Table, Modal } from 'antd';
import { IndustryTemplateInfoFacadeAddTemplateInfo } from '../service';
import styles from './index.less';

const { TextArea } = Input;

interface ModalProps {
  visible?: boolean;
  onClose?: (val: string) => void;
  dic?: any;
  saveData?: any;
  indexCodeList: any[];
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

// 弹窗
const AddView = (props: ModalProps) => {
  const { visible, saveData, onClose, indexCodeList } = props;
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

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'indexName',
      align: 'center',
      width: 200,
    },
    {
      title: '频度',
      dataIndex: 'frequency',
      align: 'center',
      width: 50,
    },
    {
      title: '单位',
      dataIndex: 'indexUnit',
      align: 'center',
      width: 50,
    },
  ];

  const rowSelection = {
    columnWidth: 40,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <Modal
        title={'多指标计算'}
        visible={visible}
        maskClosable={false}
        width={1000}
        destroyOnClose={true}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={10}>
            <Table
              dataSource={indexCodeList}
              columns={columns}
              pagination={false}
              className={styles['multi-table']}
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
            />
          </Col>
          <Col span={14}>
            <Form {...formLayout} form={form} preserve={false}>
              <Form.Item
                name="templateName"
                label={'指标名称'}
                rules={[{ required: true, message: '指标名称为必填项' }]}
              >
                <Input placeholder={'请输入模板名称'} maxLength={50} />
              </Form.Item>
              <Form.Item
                name="formula"
                label={'计算公式'}
                rules={[{ required: true, message: '计算公式为必填项' }]}
              >
                <Input placeholder={'请输入计算公式'} maxLength={50} />
              </Form.Item>
              <Form.Item
                name="frequency"
                label={'频度'}
                rules={[{ required: true, message: '频度为必填项' }]}
              >
                <Input placeholder={'请输入频度'} maxLength={50} />
              </Form.Item>
              <Form.Item
                name="indexUnit"
                label={'单位'}
                rules={[{ required: true, message: '单位为必填项' }]}
              >
                <Input placeholder={'请输入单位'} maxLength={50} />
              </Form.Item>
              <Form.Item name="remark" label={'描述'}>
                <TextArea rows={4} maxLength={2000} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default memo(AddView);
