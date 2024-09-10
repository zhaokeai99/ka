import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import DetailModal from './DetailModal';
import {
  queryOrgCustomerInfo,
  investorTypeEnum,
  getDictInfoByType,
  getOrgAgencyInfo,
} from './service';
import type { TableListItem } from './service';

// 机构客户信息列表
const AgencyCustomer = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [fundaccos, setFundaccos] = useState<any>([]);

  const handleShowModal = useCallback((values) => {
    setEditValues(values);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '天弘userId',
        dataIndex: 'thuserid',
      },
      {
        title: '基金账号',
        ellipsis: true,
        dataIndex: 'fundacco',
      },
      {
        title: '基金经理域账号',
        dataIndex: 'brokerDomainId',
      },
      {
        title: '客户类型',
        ellipsis: true,
        dataIndex: 'investorType',
        valueEnum: investorTypeEnum,
      },
      {
        title: '客户名称',
        dataIndex: 'investorName',
      },
      {
        title: '部门名称',
        dataIndex: 'deptName',
      },
      {
        title: '资金性质',
        dataIndex: 'capitalType',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'capital_type',
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },
      {
        title: '资金性质',
        dataIndex: 'capitalTypeName',
        hideInSearch: true,
      },
      {
        title: '一级分行',
        dataIndex: 'firstBranchName',
        hideInSearch: true,
      },
      {
        title: '合作部门',
        dataIndex: 'cooperDept',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'cooper_dept',
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },
      {
        title: '合作部门',
        dataIndex: 'cooperDeptName',
        hideInSearch: true,
      },
      {
        title: '理财子',
        dataIndex: 'financialManagerName',
        hideInSearch: true,
      },
      {
        title: '客户简称',
        dataIndex: 'orgAgencyCode',
        hideInTable: true,
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              request={(params) => getOrgAgencyInfo(params)}
              fieldProps={{ showSearch: true }}
            />
          );
        },
      },
      {
        title: '客户简称',
        dataIndex: 'orgAgencyName',
        hideInSearch: true,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        hideInSearch: true,
      },

      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <Button
                type="link"
                disabled={fundaccos.length}
                onClick={() => handleShowModal(record)}
              >
                配置
              </Button>
            </>
          );
        },
      },
    ];
  }, [fundaccos]);

  return (
    <>
      <ProTable<TableListItem>
        rowSelection={{
          onChange: (selectedRowKeys) => setFundaccos(selectedRowKeys),
        }}
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        rowKey="fundacco"
        request={async (params) => {
          const result = await queryOrgCustomerInfo({
            ...params,
            pageNo: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result.data || [],
            total: result.total || 0,
          };
        }}
        columns={columns}
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal({})}
            disabled={!fundaccos.length}
          >
            批量配置
          </Button>,
        ]}
      />
      <DetailModal
        visible={isShowModal}
        initValues={editValues}
        onClose={handleColse}
        fundaccos={fundaccos}
      />
    </>
  );
};

export default AgencyCustomer;
