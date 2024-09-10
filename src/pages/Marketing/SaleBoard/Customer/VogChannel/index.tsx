import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import DetailModal from './DetailModal';
import { queryVogChannelInfo, deleteVogChannel, getDictInfoByType } from './service';
import type { TableListItem } from './service';

// 考核归属渠道
const VogChannel = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const handleShowModal = useCallback((type, values) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    const { success, errorMsg } = await deleteVogChannel({ orgAgencyCode: id });
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(errorMsg || '删除失败');
    }
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '客户简称编码',
        dataIndex: 'orgAgencyCode',
        hideInSearch: true,
      },
      {
        title: '客户简称',
        dataIndex: 'orgAgencyName',
      },
      {
        title: '关联渠道编码',
        dataIndex: 'agencyCode',
        hideInSearch: true,
      },
      {
        title: '关联渠道名称',
        dataIndex: 'agencyName',
        hideInSearch: true,
      },
      {
        title: '机构一级分类',
        dataIndex: 'orgTypeName',
        hideInSearch: true,
      },
      {
        title: '机构二级分类',
        dataIndex: 'orgSubTypeName',
        hideInSearch: true,
      },
      {
        title: '机构一级分类',
        dataIndex: 'orgType',
        hideInTable: true,
        renderFormItem: (item, { type }, form) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'org_type',
              }}
              fieldProps={{
                onChange: () => {
                  form.setFieldsValue({ orgSubType: '' });
                },
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },
      {
        title: '机构二级分类',
        dataIndex: 'orgSubType',
        hideInTable: true,
        renderFormItem: (item, { type }, form) => {
          if (type === 'form') {
            return null;
          }
          const parentKey = form.getFieldValue('orgType');
          return (
            <ProFormSelect
              params={{
                dictType: 'org_sub_type',
                parentKey,
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => handleShowModal('edit', record)}>
                编辑
              </Button>
              <Popconfirm
                placement="topLeft"
                title={'删除后不可恢复，您确定要删除吗?'}
                onConfirm={() => {
                  handleDelete(record.orgAgencyCode);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger>
                  删除{' '}
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <>
      <ProTable<TableListItem>
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        rowKey="orgAgencyCode"
        request={async (params) => {
          const result = await queryVogChannelInfo({
            ...params,
            pageNo: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result || [],
          };
        }}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal('add', {})}
          >
            新增
          </Button>,
        ]}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      <DetailModal
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        onClose={handleColse}
      />
    </>
  );
};

export default VogChannel;
