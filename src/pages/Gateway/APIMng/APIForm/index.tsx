import type { FormInstance, ModalProps } from 'antd';
import type { FormProps } from '../data';
import { useEffect, useRef, useState } from 'react';
import { ModalForm, ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import { queryAppList } from '../../AppMng/service';

const APIForm: React.FC<FormProps & ModalProps> = ({
  visible,
  title,
  type,
  initialValues = {},
  submitter = true,
  onVisibleChange,
  onFinish,
}) => {
  const formRef = useRef<FormInstance>();
  const [appList, setAppList] = useState({});

  useEffect(() => {
    // 确保formRef存在
    formRef?.current?.setFieldsValue({
      ...initialValues,
      checkLogin: initialValues.checkLogin ? 'YES' : 'NO',
      isProtobuf: initialValues.isProtobuf ? 'YES' : 'NO',
    });
  }, []);

  useEffect(() => {
    queryAppList({
      pageSize: 10000,
      current: 1,
    })
      .then((res) => {
        const apps = {};
        if (res && res.data) {
          res.data.forEach((item) => {
            if (item && item.appName) {
              apps[item.appName] = item.appName;
            }
          });
        }
        setAppList(apps);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <ModalForm
      title={title}
      formRef={formRef}
      visible={!!visible}
      layout="horizontal"
      submitter={submitter}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      onVisibleChange={onVisibleChange}
      onFinish={async (values) => {
        const params = { ...values };
        if (type === 'edit') {
          params.id = initialValues?.id;
        }
        let result;
        await formRef.current?.validateFields();
        if (onFinish) {
          result = await onFinish(params);
        }
        formRef.current?.resetFields();
        return result;
      }}
    >
      <ProFormText
        rules={[{ required: true, message: '必填的项' }]}
        label="方法名"
        name="methodName"
        disabled={type === 'read'}
      />
      <ProFormText
        rules={[{ required: true, message: '必填的项' }]}
        label="操作方式"
        name="operationType"
        disabled={type === 'read'}
      />
      <ProFormText
        rules={[{ required: true, message: '必填的项' }]}
        label="接口类型"
        name="interfaceType"
        disabled={type === 'read'}
      />
      <ProFormSelect
        rules={[{ required: true, message: '必填的项' }]}
        label="应用名"
        name="applicationName"
        valueEnum={appList}
        disabled={type === 'read' || type === 'edit'}
      />
      <ProFormText label="类型" name="type" disabled={type === 'read'} />
      <ProFormText label="请求地址" name="httpUrl" disabled={type === 'read'} />
      <ProFormRadio.Group
        label="登录校验"
        name="checkLogin"
        disabled={type === 'read'}
        rules={[{ required: true, message: '必填的项' }]}
        placeholder="请选择状态"
        options={[
          { label: '是', value: 'YES' },
          { label: '否', value: 'NO' },
        ]}
      />
      <ProFormText label="鉴权模块" name="authModules" disabled={type === 'read'} />
      <ProFormRadio.Group
        label="序列化"
        name="isProtobuf"
        disabled={type === 'read'}
        rules={[{ required: true, message: '必填的项' }]}
        placeholder="请选择状态"
        options={[
          { label: '是', value: 'YES' },
          { label: '否', value: 'NO' },
        ]}
      />
      <ProFormText label="参数" name="paramtype" disabled={type === 'read'} />
      <ProFormText label="注解" name="annotations" disabled={type === 'read'} />
    </ModalForm>
  );
};

export default APIForm;
