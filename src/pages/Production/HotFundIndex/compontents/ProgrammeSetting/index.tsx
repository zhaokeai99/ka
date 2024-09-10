import React, { useRef, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, message, Popconfirm, Switch } from 'antd';
import moment from 'moment';
import './index.less';
import {
  querySolutionList,
  querySolutionTop,
  searchUserInfo,
  saveSolution,
  deleteSolution,
} from './service';
import DebounceSelect from '@/components/DebounceSelect';
import { join as _join } from 'lodash';
import ProForm, {
  ModalForm,
  ProFormDependency,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-form';

const SwitchItem = ({ item, actionRef }: any) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Switch
      loading={loading}
      checked={item.isTop}
      checkedChildren="是"
      unCheckedChildren="否"
      onChange={async (isChecked) => {
        setLoading(true);
        const res = await querySolutionTop({ ...item, isCancel: !isChecked });
        setLoading(false);
        if (res) {
          actionRef?.current?.reload();
          message.success('置顶成功');
        } else {
          message.success('置顶失败');
        }
      }}
    />
  );
};

const TableList = ({ searcherType }: { searcherType: string }) => {
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // 修改方案
  const handleOk = async () => {
    const res = await saveSolution({
      searcherType,
      ...form?.getFieldsValue(),
      visiableUser: _join(form?.getFieldsValue()?.visiableUser, ','),
      editUser: _join(form?.getFieldsValue()?.editUser, ','),
    });
    if (res) {
      actionRef?.current?.reload();
      message.success('修改成功');
      setModalOpen(false);
    } else {
      message.error('修改失败');
    }
  };

  // 删除方案
  const handleDelete = async (item: any) => {
    const { success, errorMsg } = await deleteSolution({
      id: item.id,
    });
    if (success) {
      actionRef?.current?.reload();
      message.success('删除成功');
    } else {
      message.error(errorMsg || '删除失败');
    }
  };

  const columns: any = [
    {
      title: '方案名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      render: (_: string) => moment(_).format('YYYY-MM-DD'),
    },
    {
      title: '创建人',
      search: false,
      dataIndex: 'userName',
    },
    {
      title: '可见范围',
      dataIndex: 'visibleRange',
      search: false,
    },
    {
      title: '置顶标志',
      dataIndex: 'isTop',
      search: false,
      render: (_: boolean, item: any) => {
        return <SwitchItem item={item} actionRef={actionRef} />;
      },
    },
    {
      title: '查询使用次数',
      dataIndex: 'hitCount',
      search: false,
    },
    {
      title: '操作',
      search: false,
      render: (item: any) => {
        return (
          <>
            <Button
              size="small"
              type="link"
              disabled={!!item?.edit}
              onClick={() => {
                setModalOpen(true);
                form?.setFieldsValue(item);
              }}
            >
              修改
            </Button>
            <Popconfirm
              placement="topLeft"
              title={'您确定要删除吗?'}
              onConfirm={() => handleDelete(item)}
              okText="确定"
              cancelText="取消"
              disabled={!!item?.delete}
            >
              <Button disabled={!!item?.delete} size="small" type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div className="alert">
      <ProCardPlus ghost style={{ padding: '12px' }}>
        <ProTable
          size="small"
          toolBarRender={false}
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          rowKey="fundId"
          search={{
            labelWidth: 70,
          }}
          request={async (params) => {
            return await querySolutionList({ ...params, searcherType });
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
          }}
          options={{
            density: false,
          }}
        />
      </ProCardPlus>
      <ModalForm
        title={'修改'}
        form={form}
        grid
        visible={isModalOpen}
        onFinish={handleOk}
        modalProps={{
          okText: '保存',
          onCancel: () => {
            form?.current?.resetFields();
            setModalOpen(false);
          },
          maskClosable: false,
        }}
      >
        <ProFormText name="id" hidden={true} />
        <ProForm.Group>
          <ProFormText label="查询方案名称" colProps={{ span: 12 }} name="name" />
          <ProFormText label="方案创建人" disabled colProps={{ span: 12 }} name="userNo" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormRadio.Group
            colProps={{ span: 12 }}
            name="visible"
            label="可见分享"
            options={[
              { label: '仅自己可见', value: 0 },
              { label: '全员可见', value: 1 },
              { label: '指定人员', value: 2 },
            ]}
          />
          <ProFormDependency name={['visible']}>
            {({ visible }) => {
              return (
                visible === 2 && (
                  <Col span={12}>
                    <Form.Item label="指定可见人员" name="visiableUser">
                      <DebounceSelect
                        mode="multiple"
                        style={{ width: '100%' }}
                        labelInValue={false}
                        showSearch
                        allowClear
                        placeholder="请选择"
                        fetchOptions={async (keyword: any) => searchUserInfo({ keyword })}
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
            options={[
              { label: '仅自己可编辑', value: 0 },
              { label: '全员可编辑', value: 1 },
              { label: '指定人员', value: 2 },
            ]}
          />
          <ProFormDependency name={['canEdit']}>
            {({ canEdit }) => {
              return (
                canEdit === 2 && (
                  <Col span={12}>
                    <Form.Item label="指定编辑人员" name="editUser">
                      <DebounceSelect
                        style={{ width: '100%' }}
                        mode="multiple"
                        labelInValue={false}
                        showSearch
                        allowClear
                        placeholder="请选择"
                        fetchOptions={async (keyword: any) => searchUserInfo({ keyword })}
                        isInit={true}
                      />
                    </Form.Item>
                  </Col>
                )
              );
            }}
          </ProFormDependency>
        </ProForm.Group>
      </ModalForm>
    </div>
  );
};

export default TableList;
