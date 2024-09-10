import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import Editor from '@monaco-editor/react';
import { queryScriptTypeEnum } from '../service';
import { useWatch } from 'antd/lib/form/Form';

const MyForm = ({
  visible,
  title,
  type,
  initialValues,
  submitter = true,
  onVisibleChange,
  onFinish,
}: any) => {
  // const formRef = useRef();
  const [form] = Form.useForm();
  const sType = useWatch(['scriptType'], form);
  const [scriptType, setScriptType] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      form?.setFieldsValue({
        ...initialValues,
      });
    }, 100);
  }, [initialValues]);

  useEffect(() => {
    (async () => {
      const result = await queryScriptTypeEnum();
      setScriptType(result);
    })();
  }, []);

  return (
    <ModalForm
      title={title}
      form={form}
      formRef={form}
      visible={!!visible}
      layout="horizontal"
      submitter={submitter}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 20 }}
      onVisibleChange={onVisibleChange}
      onFinish={async (values: any) => {
        const params = { ...values };
        if (type === 'edit') {
          params.scriptId = initialValues?.scriptId;
        }
        let result;
        await form.validateFields();
        if (onFinish) {
          result = await onFinish(params);
        }
        form.resetFields();
        return result;
      }}
    >
      <ProFormText
        rules={[{ required: true, message: '必填的项' }]}
        label="脚本名称"
        name="scriptName"
        disabled={type === 'read'}
      />
      <ProFormSelect
        label="脚本类型"
        name="scriptType"
        disabled={type === 'read'}
        rules={[{ required: true, message: '必填的项' }]}
        placeholder="请选择类型"
        options={scriptType}
      />
      <Form.Item
        label="脚本内容"
        name="scriptContent"
        rules={[{ required: true, message: '必填的项' }]}
      >
        <Editor
          height="350px"
          language={scriptType.find((st: any) => st.value === sType)?.type || 'plaintext'}
          theme="vs-dark"
          options={{ readOnly: type === 'read' }}
        />
      </Form.Item>
      <ProFormTextArea
        label="备注"
        name="remark"
        placeholder="请输入备注"
        disabled={type === 'read'}
      />
    </ModalForm>
  );
};

export default MyForm;
