import type { FormInstance, ModalProps } from 'antd';
import type { FormProps } from '../data';
import { Form, Button, InputNumber } from 'antd';
import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import styles from './index.less';

const toDisplayString = (data) => {
  const displayData = JSON.stringify(data, null, '\t');
  return displayData;
};

const MyForm: React.FC<FormProps & ModalProps> = ({
  visible,
  title,
  type,
  initialValues,
  submitter = true,
  onVisibleChange,
  onFinish,
}) => {
  const formRef = useRef<FormInstance>();
  const [paramListCount, setparamListCount] = useState(1);
  const [columnsCount, setColumnsCount] = useState(1);

  useEffect(() => {
    // 确保formRef存在
    if (type !== 'add') {
      setTimeout(() => {
        formRef?.current?.setFieldsValue({
          ...initialValues,
        });
      }, 100);
    }
  }, [initialValues, type]);

  const paramListCountChange = (value) => {
    setparamListCount(value);
  };

  const columnsCountChange = (value) => {
    setColumnsCount(value);
  };

  // 这里将会创建几组示例代码贴到两个组件中
  const addparamList = useCallback(() => {
    const oneData = {
      paramCode: 'fundCode',
      paramName: '基金代码',
      paramType: 'input',
      paramFormat: 'YYYYMMDD',
      ifRequired: 'Y',
      ifMulti: 'N',
      defaultValues: {},
      optionalValues: {},
      paramProcessName: '',
      dbColumn: '',
      paramOperation: '=',
      orderIndex: 0,
    };
    const paramsInit = [];
    for (let i = 0; i < paramListCount; i++) {
      paramsInit.push(oneData);
    }
    formRef?.current?.setFieldsValue({
      paramList: toDisplayString(paramsInit),
    });
  }, [paramListCount]);

  const addColumns = useCallback(() => {
    const oneData = {
      dataIndex: 'fundCode',
      dataTitle: '基金代码',
      extraSettings: {},
      orderIndex: 1,
    };
    const columnsInit = [];
    for (let i = 0; i < columnsCount; i++) {
      columnsInit.push(oneData);
    }
    formRef?.current?.setFieldsValue({
      columnList: toDisplayString(columnsInit),
    });
  }, [columnsCount]);

  // 所有字段需要跟接口对齐
  return (
    <ModalForm
      width={1000}
      className={styles.fixedIncomeDlg}
      modalProps={{
        maskClosable: false,
      }}
      title={
        <div>
          {title}
          <span
            className={styles.useGuide}
            onClick={() =>
              window.open(
                'https://yuque.thfund.com.cn/g/fc9zec/atc0og/kparf537i67czst3/collaborator/join?token=PyOc3rSKn5hPCpGs#',
              )
            }
          >
            {'使用说明'}
          </span>
        </div>
      }
      formRef={formRef}
      visible={!!visible}
      layout="horizontal"
      submitter={submitter}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      onVisibleChange={onVisibleChange}
      onFinish={async (values) => {
        const params = { ...values };
        if (type === 'edit') {
          params.modelId = initialValues?.modelId;
        }
        let result;
        if (onFinish) {
          result = await onFinish(params);
        }
        if (result) {
          await formRef.current?.validateFields();
        }
        // formRef.current?.resetFields();
        return result;
      }}
    >
      <div className={styles.container}>
        <ProFormText
          rules={[{ required: true, message: '必填的项' }]}
          label="模型名称"
          name="modelName"
          disabled={type === 'read'}
          placeholder="名称"
        />

        <ProFormTextArea
          label="模型备注"
          name="modelRemark"
          disabled={type === 'read'}
          placeholder="备注"
        />

        <Form.Item
          label="筛选条件"
          name="paramList"
          rules={[{ required: true, message: '必填的项' }]}
        >
          <Editor
            height="200px"
            language=""
            theme="vs-dark"
            options={{ readOnly: type === 'read' }}
          />
        </Form.Item>

        {type === 'add' && (
          <div className={styles.labelContainer}>
            <span className={styles.labelText}>条件数量</span>
            <InputNumber onChange={(value) => paramListCountChange(value)} min={1} max={20} />
            <span className={styles.labelTextNext}></span>
            <Button type="primary" onClick={() => addparamList()}>
              初始化
            </Button>
          </div>
        )}

        <Form.Item
          label="结果列头"
          name="columnList"
          rules={[{ required: true, message: '必填的项' }]}
        >
          <Editor
            height="300px"
            language="sql"
            theme="vs-dark"
            options={{ readOnly: type === 'read' }}
          />
        </Form.Item>

        {type === 'add' && (
          <div className={styles.labelContainer}>
            <span className={styles.labelText}>结果数量</span>
            <InputNumber onChange={(value) => columnsCountChange(value)} min={1} max={20} />
            <span className={styles.labelTextNext}></span>
            <Button type="primary" onClick={() => addColumns()}>
              初始化
            </Button>
          </div>
        )}

        <Form.Item
          label="处理逻辑"
          name="modelLogic"
          rules={[{ required: true, message: '必填的项' }]}
        >
          <Editor
            height="300px"
            language="sql"
            theme="vs-dark"
            options={{ readOnly: type === 'read' }}
          />
        </Form.Item>
      </div>
    </ModalForm>
  );
};

export default MyForm;
