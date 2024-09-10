import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message, Form, TreeSelect, InputNumber } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import {
  addRoleScreen,
  updateRoleScreen,
  booleEnum,
  queryScreenValueByType,
  queryRoles,
  getDictInfoByType,
} from './service';

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, modalType } = props;
  const [initStates] = useState({
    roleId: '',
    screenType: '',
    display: '',
    conditionType: '',
    displayCondition: [],
    control: '',
    screenValue: [],
    sorted: '',
  });

  const [treeData, setTreeData] = useState([]);
  const [ScreenType, setScreenType] = useState();
  const [RoleId, setRoleId] = useState();
  const [Control, setControl] = useState();
  const [conditionTreeData, setConditionTreeData] = useState([]);
  const [ConditionType, setConditionType] = useState();

  const screenValueOnChange = (checkedKeysValue: any) => {
    formRef.current?.setFieldsValue({ screenValue: checkedKeysValue });
  };
  const displayConditionOnChange = (checkedKeysValue: any) => {
    formRef.current?.setFieldsValue({ displayCondition: checkedKeysValue });
  };

  const dataFn = useCallback((data) => {
    return data?.map((item: any) => {
      return {
        title: item?.name,
        value: item?.code,
        children: dataFn(item?.childs || []),
      };
    });
  }, []);

  useEffect(() => {
    if (props.visible) {
      const { roleId, screenType, control, conditionType } = props.initValues;
      setScreenType(screenType);
      setControl(control);
      setConditionType(conditionType);
      setRoleId(roleId);
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
  }, [props]);

  const getScreenTree = async (roleid: any, screentype: any) => {
    const list = await queryScreenValueByType({ roleid, screentype });
    setTreeData(dataFn(list));
  };

  const setConditionTree = async (roleid: any, screentype: any) => {
    const list = await queryScreenValueByType({ roleid, screentype });
    setConditionTreeData(dataFn(list));
  };

  useEffect(() => {
    if (ScreenType && Control == '1') {
      getScreenTree(RoleId, ScreenType);
    }
  }, [ScreenType, Control, RoleId]);

  useEffect(() => {
    if (ConditionType) {
      setConditionTree(RoleId, ConditionType);
    }
  }, [ConditionType, RoleId]);

  const handleSubmit = async (value: any) => {
    let result: any = {};
    if (props.modalType === 'add') {
      result = await addRoleScreen(value);
    } else {
      result = await updateRoleScreen({
        ...value,
        id: props.initValues.id,
      });
    }
    if (result.success) {
      props.onClose('reload');
      formRef.current?.resetFields();
      return;
    }
    message.error(result.errorMsg || '接口请求失败');
  };

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title={modalType === 'add' ? '新增' : '编辑'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => {
          props.onClose('cancel');
          formRef.current?.resetFields();
        },
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        name="roleId"
        label="角色"
        placeholder="请选择角色"
        request={async () => {
          return await queryRoles();
        }}
        fieldProps={{
          onChange: (value) => {
            setRoleId(value);
          },
        }}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="screenType"
        label="筛选项类型"
        placeholder="请选择筛选项类型"
        params={{
          dictType: 'screen',
        }}
        request={async (params) => {
          const list = await getDictInfoByType(params);
          return list.filter((item: any) => item.value !== 'dept');
        }}
        fieldProps={{
          onChange: (value) => {
            setScreenType(value);
            formRef?.current?.setFieldsValue({ screenValue: [] });
          },
        }}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="display"
        label="是否展示"
        valueEnum={booleEnum}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="conditionType"
        label="展示条件类型"
        params={{
          dictType: 'screen',
        }}
        request={async (params) => {
          return await getDictInfoByType(params);
        }}
        fieldProps={{
          onChange: (value) => {
            setConditionType(value);
            formRef?.current?.setFieldsValue({ displayCondition: [] });
          },
        }}
      />
      <Form.Item label="展示条件值" name="displayCondition">
        <TreeSelect
          treeCheckable
          treeData={conditionTreeData}
          onChange={displayConditionOnChange}
          showCheckedStrategy="SHOW_PARENT"
        />
      </Form.Item>
      <ProFormSelect
        name="control"
        label="展示值是否受控"
        valueEnum={booleEnum}
        fieldProps={{
          onChange: (value) => {
            setControl(value);
          },
        }}
        rules={[{ required: true }]}
      />
      <ProFormDependency name={['control']}>
        {({ control }) => {
          if (control == '1') {
            return (
              <Form.Item label="展示值" name="screenValue" rules={[{ required: true }]}>
                <TreeSelect
                  treeCheckable
                  treeData={treeData}
                  onChange={screenValueOnChange}
                  showCheckedStrategy="SHOW_PARENT"
                />
              </Form.Item>
            );
          }
        }}
      </ProFormDependency>
      <Form.Item name="sorted" label="排序">
        <InputNumber min={-1} max={99} precision={0} />
      </Form.Item>
    </ModalForm>
  );
};

export default memo(DetailModal);
