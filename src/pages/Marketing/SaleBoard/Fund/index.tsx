import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import DetailModal from './DetailModal';
import { queryFundBasicInfo, fundRaisingTypeEnum, getDictInfoByType } from './service';
import type { TableListItem } from './service';
import { ProFormSelect } from '@ant-design/pro-form';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

// 产品列表
const FundBasicInfo = () => {
  const actionRef = useRef<ActionType>();
  const auth = useAuth({ sn: '_marketing_dataConfig_fund' });
  const [isShowModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState({});

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
        title: '母基金代码',
        dataIndex: 'orgFundCode',
        hideInSearch: true,
      },
      {
        title: '母基金名称',
        ellipsis: true,
        dataIndex: 'orgFundName',
        hideInSearch: true,
      },
      {
        title: '基金代码',
        dataIndex: 'fundCode',
        hideInTable: true,
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
        hideInTable: true,
      },
      {
        title: '基金简称',
        ellipsis: true,
        dataIndex: 'dcFundAbbr',
        renderFormItem: (item, { type }) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              request={async () => {
                return [{ label: '未配置', value: '-' }];
              }}
            />
          );
        },
      },
      {
        title: '募集类型',
        dataIndex: 'fundRaisingType',
        valueEnum: fundRaisingTypeEnum,
      },
      {
        title: '一级考核类型',
        dataIndex: 'vogName',
        hideInSearch: true,
      },
      {
        title: '二级考核类型',
        dataIndex: 'vogSubName',
        hideInSearch: true,
      },
      {
        title: '一级考核类型',
        dataIndex: 'vogType',
        hideInTable: true,
        renderFormItem: (item, { type }, form) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'fund_vog_type',
              }}
              fieldProps={{
                onChange: () => {
                  form.setFieldsValue({ vogSubType: '' });
                },
              }}
              request={async (params) => {
                const list = await getDictInfoByType(params);
                return [...list, { label: '未配置', value: '-' }];
              }}
            />
          );
        },
      },
      {
        title: '二级考核类型',
        dataIndex: 'vogSubType',
        hideInTable: true,
        renderFormItem: (item, { type }, form) => {
          if (type === 'form') {
            return null;
          }
          const parentKey = form.getFieldValue('vogType');
          return (
            <ProFormSelect
              params={{
                dictType: 'fund_vog_sub_type',
                parentKey,
              }}
              request={async (params) => {
                const list = await getDictInfoByType(params);
                return [...list, { label: '未配置', value: '-' }];
              }}
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
              <Button type="link" onClick={() => handleShowModal(record)}>
                类型配置
              </Button>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <ProCardPlus style={{ paddingTop: '4px' }} ghost gutter={[0, 8]} size="small">
      {auth ? (
        <>
          <ProTable<TableListItem>
            scroll={{ x: 'max-content' }}
            search={{ labelWidth: 120 }}
            size="small"
            actionRef={actionRef}
            rowKey="fundCode"
            request={async (params) => {
              const result = await queryFundBasicInfo({
                ...params,
                currentPage: params.current,
                pageSize: params.pageSize,
              });
              return {
                data: result || [],
              };
            }}
            columns={columns}
            pagination={{ pageSize: 10 }}
          />
          <DetailModal visible={isShowModal} initValues={editValues} onClose={handleColse} />
        </>
      ) : (
        <NoPermissionCard />
      )}
    </ProCardPlus>
  );
};

export default FundBasicInfo;
