import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { TableListItem } from './service';
import {
  EsIntegrationSourceQuery,
  EsDeleteIntegrationSource,
  EsQueryIntegrationSourceByPage,
} from './service';
import IntegrationSourcMoadl from './components/IntegrationSourcMoadl';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';

const { confirm } = Modal;

// 投资->后台管理->数据源管理
const DataSourceManagement = () => {
  const actionRef = useRef<ActionType>();

  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});
  const [sourceName, setSourceName] = useState<any>([]);

  const initSeletor = async () => {
    const result = await EsIntegrationSourceQuery();
    if (result.success) {
      setSourceName(result.data);
    }
  };

  useEffect(() => {
    // 初始化信息
    initSeletor();
  }, []);

  const request = async (params?: any) => {
    const result = await EsQueryIntegrationSourceByPage({
      current: params.current,
      pageSize: params.pageSize,
      sortField: 'id',
      sortOrder: 'ASC',
      sourceType: params.sourceType,
      sourceName: params.sourceName,
    });

    const { data = [], current, pageSize, pages, total } = result?.data || {};

    if (JSON.stringify(result) !== '{}') {
      return {
        data,
        current,
        pageSize,
        pages,
        total,
        success: true,
      };
    }

    return {
      data: [],
      success: true,
    };
  };

  const handleShowModal = useCallback((type, values) => {
    setEditValues(values);
    setModalType(type);
    setShowModal(true);
  }, []);

  const handleColse = useCallback((key) => {
    setShowModal(false);
    if (key === 'reload') {
      // 重新拉取基准字典
      initSeletor();
      actionRef.current?.reload();
    }
  }, []);

  const remove = useCallback(async (record: any) => {
    const result = await EsDeleteIntegrationSource({
      id: record.id,
    });
    if (result.success) {
      // 重新拉取基准字典
      initSeletor();
      actionRef?.current?.reload();
      return;
    }
    message.error(result.errorMsg || '接口请求失败');
  }, []);

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: '你确认删除该数据源吗?',
      content: '数据源描述:' + record.sourceName,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        remove(record);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '数据源名称',
        ellipsis: true,
        dataIndex: 'sourceName',
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(sourceName, 'sourceName', 'sourceName'),
        fieldProps: { showSearch: true },
      },
      {
        title: '数据源类型',
        ellipsis: true,
        dataIndex: 'sourceType',
        valueType: 'select',
        valueEnum: {
          mysql: 'MYSQL',
          oracle: 'ORACLE',
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '数据源描述',
        ellipsis: true,
        dataIndex: 'sourceDesc',
        hideInSearch: true,
      },
      {
        title: 'jdbcUrl',
        width: '30%',
        ellipsis: true,
        dataIndex: 'jdbcUrl',
        hideInSearch: true,
      },

      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        ellipsis: true,
        render: (text, record) => [
          <a
            onClick={() => {
              handleShowModal('edit', record);
            }}
          >
            编辑
          </a>,
          <a
            onClick={() => {
              showDeleteConfirm(record);
            }}
          >
            删除
          </a>,
        ],
      },
    ];
  }, [sourceName]);

  return (
    <ProCard
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
      size="small"
    >
      <ProTable<TableListItem>
        headerTitle="数据源管理"
        rowKey={`${+new Date() + Math.random()}`}
        size="small"
        actionRef={actionRef}
        columnEmptyText={false}
        search={{ labelWidth: 'auto' }}
        form={{ ignoreRules: true }}
        toolBarRender={() => [
          <Button
            key="add_button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleShowModal('add', {})}
          >
            新建
          </Button>,
        ]}
        request={request}
        columns={columns}
        pagination={{ current: 1, pageSize: 10 }}
        options={{ density: false }}
      />
      <IntegrationSourcMoadl
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        onClose={handleColse}
      />
    </ProCard>
  );
};

export default memo(DataSourceManagement);
