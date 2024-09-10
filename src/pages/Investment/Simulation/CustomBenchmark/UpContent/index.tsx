import React, { useMemo, useRef } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './service';
import { MpBmSelfdefQueryByPage } from './service';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';

interface PropsType {
  customBenchmark: any;
  customMpdomain: any;
}

// 自定义基准
const CustomBenchmark = (props: PropsType) => {
  const { customBenchmark, customMpdomain } = props;
  const actionRef = useRef<ActionType>();

  const request = async (params?: any) => {
    const result = await MpBmSelfdefQueryByPage({
      current: params.current,
      pageSize: params.pageSize,
      bmCode: params.bmName,
      domain: params.domain,
      bmType: 3,
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
        valueEnum: ProTableHandle.toValueEnum(customBenchmark, 'label', 'value'),
        fieldProps: { showSearch: true },
      },
      {
        title: '业务域',
        ellipsis: true,
        dataIndex: 'domain',
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(customMpdomain, 'label', 'value'),
        fieldProps: { showSearch: true },
      },
      {
        title: '证券代码',
        ellipsis: true,
        dataIndex: 'stkCode',
        hideInSearch: true,
      },
      {
        title: '证券名称',
        ellipsis: true,
        dataIndex: 'stkName',
        hideInSearch: true,
      },
      {
        title: '市场代码',
        ellipsis: true,
        dataIndex: 'mtkCode',
        hideInSearch: true,
      },
      {
        title: '初始权重',
        ellipsis: true,
        dataIndex: 'iniWeight',
        hideInSearch: true,
      },
    ];
  }, [customBenchmark, customMpdomain]);

  return (
    <ProCard ghost direction="column" gutter={[0, cardGutter]}>
      <ProTable<TableListItem>
        headerTitle={'基准成分信息'}
        rowKey={`${+new Date() + Math.random()}`}
        size="small"
        actionRef={actionRef}
        search={{ labelWidth: 'auto' }}
        columnEmptyText={false}
        form={{ ignoreRules: true }}
        request={request}
        columns={columns}
        pagination={{ current: 1, pageSize: 10 }}
        options={{ density: false }}
      />
    </ProCard>
  );
};

CustomBenchmark.isProCard = true;

export default CustomBenchmark;
