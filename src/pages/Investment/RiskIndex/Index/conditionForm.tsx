import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { useRef, useEffect } from 'react';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { filter as _filter } from 'lodash';

const ConditionForm = (props: any) => {
  const {
    visible,
    type,
    title,
    initialValues,
    onVisibleChange,
    nodeType,
    onFinish,
    paramNameSelect,
  } = props;
  const formRef = useRef<FormInstance>();
  const [form] = Form.useForm();
  const paramValueType = Form.useWatch('paramValueType', form);
  useEffect(() => {
    // 确保formRef存在
    setTimeout(() => {
      formRef?.current?.setFieldsValue({
        ...initialValues,
        moveValue: initialValues?.replaceVariableModel?.moveValue,
        replaceVariable: initialValues?.replaceVariableModel?.replaceVariable,
      });
    }, 100);
  }, [props]);

  return (
    <ModalForm
      width="60%"
      form={form}
      title={title}
      formRef={formRef}
      modalProps={{
        destroyOnClose: true,
      }}
      visible={!!visible}
      layout={'horizontal'}
      onVisibleChange={onVisibleChange}
      onFinish={async (values: any) => {
        const params = {
          ...values,
          replaceVariableModel: {
            moveValue: values.moveValue,
            replaceVariable: values.replaceVariable,
          },
        };

        delete params.moveValue;
        delete params.replaceVariable;
        await formRef.current?.validateFields();
        const result = await onFinish(
          nodeType === 'custom' && values?.paramValueType !== 'replace' ? { ...values } : params,
        );
        formRef.current?.resetFields();
        return result;
      }}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 14 }}
    >
      <ProFormSelect
        label="参数名称"
        name={'paramName'}
        placeholder="请选择"
        rules={[{ required: true, message: '必选' }]}
        options={paramNameSelect}
        fieldProps={{
          onSelect: (value: any) => {
            if (nodeType === 'custom') {
              formRef?.current?.setFieldsValue(_filter(paramNameSelect, { paramValue: value })[0]);
            } else {
              formRef?.current?.setFieldsValue({
                fieldType: paramNameSelect?.find((item: any) => item.columnName === value)
                  ?.dataType,
                paramValue: paramNameSelect?.find((item: any) => item.columnName === value)
                  .columnName,
              });
            }
          },
        }}
      />
      <div style={{ display: 'none' }}>
        <ProFormText name="id" />
      </div>
      <ProFormText label="字段类型" name="fieldType" disabled={type === 'edit' ? true : false} />
      <ProFormSelect
        label="条件类型"
        name="conditionType"
        placeholder="请选择 必选or非必选"
        rules={[{ required: true, message: '必选' }]}
        options={[
          { label: '非必选', value: 'noMandatory' },
          { label: '必选', value: 'mandatory' },
        ]}
      />
      <ProFormText label="别名" name="paramValue" />
      <ProFormText label="参数描述" name="paramDesc" />
      <ProFormText
        label="运算符"
        name="operator"
        rules={nodeType !== 'custom' ? [{ required: true, message: '必填' }] : false}
      />
      <ProFormSelect
        label="参数类型"
        name="paramValueType"
        placeholder="请选择"
        rules={[{ required: true, message: '必选' }]}
        options={[
          { label: '变量', value: 'variable' },
          { label: '替换量', value: 'replace' },
          { label: '常量', value: 'constValue' },
        ]}
      />
      {paramValueType === 'replace' && (
        <>
          <ProFormText label="替换量" name="replaceVariable" />
          <ProFormText label="偏移量" name="moveValue" />
        </>
      )}
      {paramValueType === 'constValue' && (
        <>
          <ProFormText label="值" name="constValue" rules={[{ required: true, message: '必填' }]} />
        </>
      )}
    </ModalForm>
  );
};

export default ConditionForm;
