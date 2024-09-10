import React, { memo, useState } from 'react';
import { Button, Col, Space, Form, FormInstance, Input, message, Row } from 'antd';
import { EsIndexDataInfoFacadeSearchIndexByJson } from './service';
import CodeForm from './JsonCodeForm';

const { TextArea } = Input;

function isJson(str: any) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

interface ModalProps {
  formValue: any;
  form: FormInstance;
}

const CatInfo = (props: ModalProps) => {
  const { formValue, form } = props;
  const [jsonResult, setJsonResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const runTask = async () => {
    const values = await form.validateFields();
    let json = values.runParam;
    if (json !== undefined) {
      json = json.replace(' ', '');
      if (json.substring(0, 1) !== '{' || !isJson(json)) {
        message.error('执行参数，格式为json串');
        return;
      }
    }
    const params = { index: values.indexName, json: json };
    setLoading(true);
    const data = await EsIndexDataInfoFacadeSearchIndexByJson(params);
    setLoading(false);
    if (data.success) {
      setJsonResult(JSON.stringify(JSON.parse(data.data), null, 2));
    } else {
      message.error(data.errorMsg);
    }
  };
  //压缩
  const zipCode = async () => {
    const json = form.getFieldValue('runParam');
    if (json !== undefined) {
      const tmp = json.replace(' ', '');
      if (tmp.substring(0, 1) !== '{' || !isJson(tmp)) {
        message.error('执行参数，格式为json串');
        return;
      }
    }
    const code = JSON.stringify(JSON.parse(json));
    form.setFieldsValue({ runParam: code });
  };
  //格式式
  const formatCode = async () => {
    const json = form.getFieldValue('runParam');
    if (json !== undefined) {
      const tmp = json.replace(' ', '');
      if (tmp.substring(0, 1) !== '{' || !isJson(tmp)) {
        message.error('执行参数，格式为json串');
        return;
      }
    }
    const code = JSON.stringify(JSON.parse(json), null, 2);
    form.setFieldsValue({ runParam: code });
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        preserve={false}
      >
        <Form.Item label="索引名称" name="indexName" initialValue={formValue.indexName}>
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item
          label="执行参数"
          name="runParam"
          rules={[{ required: false, message: '请输入执行参数!' }]}
        >
          <TextArea rows={10} />
        </Form.Item>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Space>
              <Button onClick={formatCode}>格式化</Button>
              <Button onClick={zipCode}>压缩</Button>
              <Button type={'primary'} onClick={runTask} loading={loading}>
                查询
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={24}>
          <CodeForm textContent={jsonResult} language={'json'} darkMode />
        </Col>
      </Row>
    </>
  );
};
export default memo(CatInfo);
