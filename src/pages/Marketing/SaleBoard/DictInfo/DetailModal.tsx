import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message, Cascader, Form, Select, InputNumber } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { addDict, updateDict, getDictType, getDictTypeTree } from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType, initValues, onClose } = props;
  const [initStates] = useState({
    dictTypeId: '',
    dictKey: '',
    dictValue: '',
    parentKey: [],
    display: '',
    sorted: '',
    memo: '',
  });
  const [DictType, setDictType] = useState([]);
  const [treeData, setTreedata] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    if (visible) {
      if (modalType === 'edit' && Object.keys(initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = initValues[key] || '';
        });
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [props]);

  useEffect(() => {
    getDictTypeTree().then((res) => {
      setTreedata(res);
    });
    getDictType().then((res) => {
      setDictType(res);
    });
  }, [props]);

  const handleSubmit = useCallback(
    async (value) => {
      let result: any = {};
      const { parentKey } = value;
      if (modalType === 'add') {
        result = await addDict({
          ...value,
          parentKey: parentKey ? parentKey[parentKey?.length - 1] : '',
        });
      } else {
        result = await updateDict({
          ...value,
          id: initValues.id,
          parentKey: typeof parentKey === 'string' ? parentKey : parentKey[parentKey?.length - 1],
        });
      }
      if (result.success) {
        onClose('reload');
        return;
      }
      message.error(result.errorMsg || '接口请求失败');
    },
    [props],
  );

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title={modalType === 'add' ? '新增' : '编辑'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        name="dictTypeId"
        label="字典类型"
        options={DictType}
        placeholder="请选择字典类型"
        rules={[{ required: true }]}
      />
      {modalType === 'add' ? (
        <ProFormText
          name="dictKey"
          label="字典项key"
          placeholder="请输入字典项key"
          rules={[{ required: true }]}
        />
      ) : null}
      <ProFormText
        name="dictValue"
        label="字典项描述"
        placeholder="请输入字典项描述"
        rules={[{ required: true }]}
      />
      <Form.Item name="parentKey" label="父级字典">
        <Cascader options={treeData} placeholder="请选择父级字典" />
      </Form.Item>
      <Form.Item name="display" label="是否展示">
        <Select defaultValue="1" style={{ width: 89 }}>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      </Form.Item>
      <Form.Item name="sorted" label="排序">
        <InputNumber min={0} max={99} precision={0} />
      </Form.Item>
      <ProFormText name="memo" label="备注" placeholder="请输入备注信息" />
    </ModalForm>
  );
};

export default memo(DetailModal);
