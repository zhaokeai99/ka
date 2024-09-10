import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { message } from 'antd';
import { ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { setUserRole, queryRoles } from './service';

interface ModalProps {
  visible: boolean;
  initValues?: any;
  userIds: any;
  onClose: (val?: string) => void;
}

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const { visible, userIds } = props;
  const [initStates] = useState({
    userName: '',
    mobile: '',
    email: '',
    roleIds: [],
  });
  const [Roles, setRoles] = useState([]);

  useEffect(() => {
    if (props.visible) {
      if (Object.keys(props.initValues).length >= 0) {
        const formValues = {};
        Object.keys(initStates).forEach((key: string) => {
          if (key === 'roleIds') {
            formValues[key] = props?.initValues?.roles?.map((item: any) => {
              return item?.roleId;
            });
          } else {
            formValues[key] = props.initValues[key] || '';
          }
        });

        formRef.current?.setFieldsValue(formValues);
      } else {
        formRef.current?.setFieldsValue(initStates);
      }
    }
    queryRoles().then((res) => {
      setRoles(res);
    });
  }, [props]);

  const handleSubmit = useCallback(
    async (value) => {
      const { success, errorMsg } = await setUserRole({
        ...value,
        roleIds: [value.roleIds],
        ...(Array.isArray(userIds) && userIds.length > 0
          ? { userIds }
          : { userId: props.initValues.userId }),
      });
      if (success) {
        props.onClose('reload');
        return;
      }
      message.error(errorMsg || '接口请求失败');
    },
    [props],
  );

  return (
    <ModalForm
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title="人员角色配置"
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => props.onClose('cancel'),
        maskClosable: false,
      }}
      onFinish={handleSubmit}
    >
      {!userIds?.length ? (
        <>
          <ProFormText name="userName" label="用户姓名" disabled />
          <ProFormText name="mobile" label="手机号" disabled />
          <ProFormText name="email" label="邮箱" disabled />
        </>
      ) : null}
      <ProFormSelect
        name="roleIds"
        label="角色设置"
        options={Roles}
        placeholder="请选择角色"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default memo(DetailModal);
