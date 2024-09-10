import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import ProCardPlus from '@/components/ProCardPlus';
import DetailModal from './DetailModal';
import { queryAgencyBasicInfo, getDictInfoByType } from './service';
import type { TableListItem } from './service';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionCard from '@/components/NoPermissionCard';

// 渠道信息列表
const AgencyInfo = () => {
  const actionRef = useRef<ActionType>();
  const auth = useAuth({ sn: '_marketing_dataConfig_agency' });
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
        title: '渠道编码',
        dataIndex: 'agencyCode',
      },
      {
        title: '渠道名称',
        dataIndex: 'agencyName',
      },
      {
        title: '渠道一级分类',
        dataIndex: 'agencyKindName',
        hideInSearch: true,
      },
      {
        title: '渠道二级分类',
        dataIndex: 'agencySubKindName',
        hideInSearch: true,
      },
      {
        title: '渠道一级分类',
        dataIndex: 'agencyKind',
        hideInTable: true,
        renderFormItem: (item, { type }, form) => {
          if (type === 'form') {
            return null;
          }
          return (
            <ProFormSelect
              params={{
                dictType: 'agency_kind',
              }}
              fieldProps={{
                onChange: () => {
                  form.setFieldsValue({ agencySubKind: '' });
                },
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },
      {
        title: '渠道二级分类',
        dataIndex: 'agencySubKind',
        hideInTable: true,
        renderFormItem: (item, { type }, form) => {
          if (type === 'form') {
            return null;
          }
          const parentKey = form.getFieldValue('agencyKind');
          return (
            <ProFormSelect
              params={{
                dictType: 'agency_sub_kind',
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
            rowKey="agencyCode"
            request={async (params) => {
              const result = await queryAgencyBasicInfo({
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

export default AgencyInfo;
