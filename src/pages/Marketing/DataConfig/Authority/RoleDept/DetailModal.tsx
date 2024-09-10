import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message, Form, TreeSelect } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { addRole, updateRole, queryOrgUserInfoTree } from './service';

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
    roleName: '',
    salesAgencyType: '',
  });

  const [deptTree, setDeptTree] = useState([]);

  const onChange = (checkedKeysValue: any) => {
    formRef.current?.setFieldsValue({ authDeptIds: checkedKeysValue });
  };

  const dataFn = useCallback((data) => {
    return data?.map((item: any) => {
      return {
        title: item?.deptName,
        value: item?.deptId,
        children: dataFn(item?.childDepts || []),
      };
    });
  }, []);

  useEffect(() => {
    if (props.visible) {
      if (props.modalType === 'edit' && Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          formValues[key] = props.initValues[key] || '';
        });
        formValues['authDeptIds'] = props.initValues.authDepts?.map((i: any) => i.deptId + '');
        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
    queryOrgUserInfoTree().then((res) => {
      const deptTreeData = dataFn(res?.data);
      setDeptTree(deptTreeData);
    });
  }, [props]);

  const handleSubmit = async (value: any) => {
    let result: any = {};
    if (props.modalType === 'add') {
      result = await addRole(value);
    } else {
      result = await updateRole({
        ...value,
        roleId: props.initValues.roleId,
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
      <ProFormText
        name="roleName"
        label="角色名称"
        placeholder="请输入角色名称"
        rules={[{ required: true }]}
      />
      <Form.Item
        label="权限部门"
        name="authDeptIds"
        rules={[{ required: true, message: '请选择权限部门' }]}
      >
        <TreeSelect
          treeCheckable
          treeData={deptTree}
          onChange={onChange}
          showCheckedStrategy="SHOW_PARENT"
        />
      </Form.Item>
    </ModalForm>
  );
};

export default memo(DetailModal);
