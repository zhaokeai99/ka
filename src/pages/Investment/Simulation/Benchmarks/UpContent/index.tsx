import React, { useCallback, useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './service';
import { MpBmComplexQueryByPage } from './service';
import { cardGutter } from '@/themes';
import BenchmarksModal from './components/BenchmarksModal';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';

interface PropsType {
  mpBenchmarkDic: any;
  domainDic: any;
}

// 复合基准
const Benchmarks = (props: PropsType) => {
  const { mpBenchmarkDic, domainDic } = props;
  const actionRef = useRef<ActionType>();

  const [isShowModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editValues, setEditValues] = useState({});

  const request = async (params: any) => {
    const result = await MpBmComplexQueryByPage({
      bmCode: params.bmName,
      domain: params.domain,
      bmType: 2,

      current: params.current,
      pageSize: params.pageSize,
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
      actionRef.current?.reload();
    }
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
        dataIndex: 'bmName',
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(mpBenchmarkDic, 'label', 'value'),
        fieldProps: { showSearch: true },
      },
      {
        title: '业务域',
        ellipsis: true,
        dataIndex: 'domain',
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(domainDic, 'label', 'value'),
        fieldProps: { showSearch: true },
      },
      {
        title: '指数代码',
        ellipsis: true,
        dataIndex: 'indexCode',
        hideInSearch: true,
      },
      {
        title: '指数名称',
        ellipsis: true,
        dataIndex: 'indexName',
        hideInSearch: true,
      },
      {
        title: '指数权重(%)',
        ellipsis: true,
        dataIndex: 'weight',
        hideInSearch: true,
      },
      {
        title: '指数分类路径',
        ellipsis: true,
        dataIndex: 'indexClassPath',
        hideInSearch: true,
        width: '30%',
      },
      {
        title: '指数发行公司',
        ellipsis: true,
        dataIndex: 'indexSysName',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        ellipsis: true,
        render: (text, record) => [
          <a
            key={'edit'}
            onClick={() => {
              handleShowModal('edit', record);
            }}
          >
            编辑
          </a>,
        ],
      },
    ];
  }, [mpBenchmarkDic, domainDic]);

  return (
    <ProCard ghost direction="column" gutter={[0, cardGutter]}>
      <ProTable
        headerTitle={'基准成分信息'}
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
      <BenchmarksModal
        visible={isShowModal}
        modalType={modalType}
        initValues={editValues}
        mpDomain={domainDic}
        onClose={handleColse}
      />
    </ProCard>
  );
};

Benchmarks.isProCard = true;

export default Benchmarks;
