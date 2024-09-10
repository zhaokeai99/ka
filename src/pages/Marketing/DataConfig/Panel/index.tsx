import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import DetailModal from './DetailModal';
import { queryFundBasicInfo, getDictInfoByType } from './service';
import type { TableListItem } from './service';
import { PlusOutlined } from '@ant-design/icons';

// 产品信息列表
const FundPanelType = () => {
  const actionRef = useRef<ActionType>();
  const [isShowModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [fundcodes, setFundcodes] = useState<any>([]);

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
        hideInSearch: true,
      },

      {
        title: '大盘显示类型',
        dataIndex: 'panelShowType',
        hideInTable: true,
        renderFormItem: (item, { type }, form) => {
          if (type === 'form') {
            return null;
          }
          const parentKey = form.getFieldValue('panelShowTypeType');
          return (
            <ProFormSelect
              params={{
                dictType: 'panel_show_type',
                parentKey,
              }}
              request={(params) => getDictInfoByType(params)}
            />
          );
        },
      },

      {
        title: '大盘显示类型',
        dataIndex: 'panelShowName',
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
                disabled={fundcodes.length}
                onClick={() => {
                  setFundcodes(record.orgFundCode.toString());
                  handleShowModal(record);
                }}
              >
                配置
              </Button>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <ProCardPlus
      style={{ padding: '12px 12px' }}
      ghost
      gutter={[0, 8]}
      size="small"
      sn="_marketing_dataConfig_panel"
    >
      <ProTable<TableListItem>
        rowSelection={{
          onChange: (selectedRowKeys) => setFundcodes(selectedRowKeys),
        }}
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 120 }}
        size="small"
        actionRef={actionRef}
        rowKey="orgFundCode"
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
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal({})}
            disabled={!fundcodes.length}
          >
            批量配置
          </Button>,
        ]}
      />
      <DetailModal
        visible={isShowModal}
        initValues={editValues}
        onClose={handleColse}
        fundcodes={fundcodes}
      />
    </ProCardPlus>
  );
};

export default FundPanelType;
