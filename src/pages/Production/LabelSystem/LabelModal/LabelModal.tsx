import DebounceSelect from '@/components/DebounceSelect';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSwitch,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { Col, Form, TreeSelect } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import {
  queryParentMarkDropDown,
  saveFundMarkData,
  searchUserInfo,
  updateFundMarkData,
} from '../service';

type PropsType = {
  visible: boolean;
  type: string;
  editInfo: {
    labelId: number;
    markType: string;
    id: number;
    isTop: number;
    markCanEdit: number;
    editUser: string;
    visiableUser: string;
    owner: string;
  };
  onClose: (type?: string, params?: {}) => void;
};

const LabelModal: React.FC<any> = (props: PropsType) => {
  const { visible, type, editInfo, onClose } = props;
  const formRef = useRef<ProFormInstance>();
  const formCanEdit = editInfo?.markCanEdit === 1; // 0:可以编辑 1：不可以编辑
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    if (visible) {
      formRef.current?.setFieldsValue({
        ...editInfo,
        isTop: editInfo?.isTop === 0,
        editUser: editInfo.editUser ? editInfo.editUser.split(',') : [],
        visiableUser: editInfo.visiableUser ? editInfo.visiableUser.split(',') : [],
        owner: editInfo?.owner || `${initialState?.realName}(${initialState?.userName})`,
      });
    }
  }, [visible, editInfo, initialState]);

  // 处理指定人员
  const handleUsersName = (str: string) => {
    if (!str) return '';
    const regex = /\((.+?)\)/g;
    const arr = str.match(regex)?.map((i: string) => i.replace('(', '').replace(')', ''));
    return arr?.join(',') || '';
  };

  // 保存/编辑
  const onFinish = useCallback(
    async (values: any) => {
      const editUser = handleUsersName(values?.editUser?.join(','));
      const visiableUser = handleUsersName(values?.visiableUser?.join(','));
      const owner = handleUsersName(values?.owner);
      const { success } =
        type === 'ADD'
          ? await saveFundMarkData({
              ...values,
              owner,
              editUser,
              visiableUser,
            })
          : await updateFundMarkData({
              ...values,
              markId: editInfo?.id,
              owner,
              editUser,
              visiableUser,
            });
      if (success) {
        formRef?.current?.resetFields();
        onClose('RELOAD', { markType: editInfo?.markType, markId: editInfo?.labelId });
      }
    },
    [type, editInfo],
  );

  return (
    <ModalForm
      title={type === 'ADD' ? '添加标签' : '修改标签'}
      formRef={formRef}
      visible={visible}
      onFinish={onFinish}
      modalProps={{
        okText: '保存',
        onCancel: () => {
          formRef?.current?.resetFields();
          onClose('CANCEL');
        },
        maskClosable: false,
      }}
      grid
    >
      <ProForm.Group>
        <ProFormText
          label="标签分类"
          name="labelType"
          rules={[{ required: true }]}
          disabled
          colProps={{ span: 12 }}
        />
        <ProFormTreeSelect
          label="父级分类"
          name="parentId"
          rules={[{ required: true }]}
          params={{ markType: editInfo?.markType }}
          request={async () => {
            return await queryParentMarkDropDown({
              markType: editInfo?.markType,
            });
          }}
          fieldProps={{
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
          }}
          placeholder="请选择"
          colProps={{ span: 12 }}
          disabled={formCanEdit}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="标签名称"
          name="titleName"
          rules={[{ required: true }]}
          placeholder="请输入"
          colProps={{ span: 12 }}
          disabled={formCanEdit}
        />
        <Col span={12}>
          <Form.Item label="标签拥有人" name="owner">
            <DebounceSelect
              style={{ width: '100%' }}
              labelInValue={false}
              showSearch
              allowClear
              placeholder="请选择"
              fetchOptions={async (keyword: any) => searchUserInfo({ keyword })}
              isInit={true}
              disabled={formCanEdit}
            />
          </Form.Item>
        </Col>
      </ProForm.Group>
      <ProFormSwitch
        width="md"
        name="isTop"
        label="全景图置顶"
        checkedChildren="是"
        unCheckedChildren="否"
        initialValue={false}
        rules={[{ required: true }]}
        transform={(value) => ({
          isTop: value ? 0 : 1,
        })}
        disabled={formCanEdit}
      />
      <ProForm.Group>
        <ProFormRadio.Group
          colProps={{ span: 12 }}
          name="visiable"
          label="可见分享"
          rules={[{ required: true }]}
          options={[
            { label: '仅自己可见', value: 0 },
            { label: '全员可见', value: 1 },
            { label: '指定人员', value: 2 },
          ]}
          disabled={formCanEdit}
        />
        <ProFormDependency name={['visiable']}>
          {({ visiable }) => {
            return (
              visiable === 2 && (
                <Col span={12}>
                  <Form.Item rules={[{ required: true }]} label="指定可见人员" name="visiableUser">
                    <DebounceSelect
                      mode="multiple"
                      style={{ width: '100%' }}
                      labelInValue={false}
                      showSearch
                      allowClear
                      placeholder="请选择"
                      fetchOptions={async (keyword: any) => searchUserInfo({ keyword })}
                      disabled={formCanEdit}
                    />
                  </Form.Item>
                </Col>
              )
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          colProps={{ span: 12 }}
          name="canEdit"
          label="编辑分享"
          rules={[{ required: true }]}
          options={[
            { label: '仅自己可编辑', value: 0 },
            { label: '全员可编辑', value: 1 },
            { label: '指定人员', value: 2 },
          ]}
          disabled={formCanEdit}
        />
        <ProFormDependency name={['canEdit']}>
          {({ canEdit }) => {
            return (
              canEdit === 2 && (
                <Col span={12}>
                  <Form.Item rules={[{ required: true }]} label="指定编辑人员" name="editUser">
                    <DebounceSelect
                      mode="multiple"
                      style={{ width: '100%' }}
                      labelInValue={false}
                      showSearch
                      allowClear
                      placeholder="请选择"
                      fetchOptions={async (keyword: any) => searchUserInfo({ keyword })}
                      isInit={true}
                      disabled={formCanEdit}
                    />
                  </Form.Item>
                </Col>
              )
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
    </ModalForm>
  );
};

export default LabelModal;
