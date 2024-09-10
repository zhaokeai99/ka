import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListItem } from './service';
import { MpBenchmarkDelete, MpBenchmarkQuery, MpDomainQuery, queryByPage } from './service';
import MainBenchmarkMoadl from './components/MainBenchmarkMoadl';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';

// 投资->模拟组合->基准管理->主基准管理
const MainBenchmark = () => {
  const actionRef = useRef<ActionType>();

  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});
  const [domainDic, setDomainDic] = useState<any>([]); // 业务域字典
  const [mpBenchmarkDic, setMpBenchmarkDic] = useState<any>([]); // 基准字典

  const initMpBenchmarkDic = async () => {
    const result = await MpBenchmarkQuery();
    if (result) {
      setMpBenchmarkDic(result);
    }
  };

  const initDomainDic = async () => {
    const result = await MpDomainQuery();
    if (result) {
      setDomainDic(result);
    }
  };

  useEffect(() => {
    // 初始化基准信息
    initMpBenchmarkDic();
    // 初始化业务域
    initDomainDic();
  }, []);

  const request = async (params?: any) => {
    const result = await queryByPage({
      current: params.current,
      pageSize: params.pageSize,
      bmCode: params.bmName,
      bmType: params.bmType,
      domain: params.domain,
    });

    const { data = [], current, pageSize, pages, total } = result || {};

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
      initMpBenchmarkDic();
      actionRef.current?.reload();
    }
  }, []);

  const remove = useCallback(async (record: any) => {
    const result = await MpBenchmarkDelete({
      id: record.id,
    });
    if (result.success) {
      // 重新拉取基准字典
      initMpBenchmarkDic();
      actionRef?.current?.reload();
      return;
    }
    message.error(result.errorMsg || '接口请求失败');
  }, []);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        title: '基准代码',
        ellipsis: true,
        dataIndex: 'bmCode',
        hideInSearch: true,
      },
      {
        title: '基准名称',
        ellipsis: true,
        key: 'bmName',
        dataIndex: 'bmName',
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(mpBenchmarkDic, 'label', 'value'),
        fieldProps: { showSearch: true },
      },
      {
        title: '基准类型',
        ellipsis: true,
        valueType: 'select',
        dataIndex: 'bmType',
        valueEnum: {
          '1': '市场指数',
          '2': '复合基准',
          '3': '自定义基准',
        },
        fieldProps: { showSearch: true },
      },
      {
        title: '业务域',
        ellipsis: true,
        valueType: 'select',
        key: 'domain',
        dataIndex: 'domain',
        valueEnum: ProTableHandle.toValueEnum(domainDic, 'label', 'value'),
        fieldProps: { showSearch: true },
      },
      {
        title: '基准说明',
        ellipsis: true,
        dataIndex: 'bmComment',
        hideInSearch: true,
        width: '30%',
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
              remove(record);
            }}
          >
            删除
          </a>,
        ],
      },
    ];
  }, [mpBenchmarkDic, domainDic]);

  return (
    <ProCard
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
      size="small"
    >
      <ProTable<TableListItem>
        headerTitle="基准成分信息"
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
            创建基准
          </Button>,
        ]}
        request={request}
        columns={columns}
        pagination={{ current: 1, pageSize: 10 }}
        options={{ density: false }}
      />
      <MainBenchmarkMoadl
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        domainDic={domainDic}
        onClose={handleColse}
      />
    </ProCard>
  );
};

export default memo(MainBenchmark);
