import React, { useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './service';
import { MpBmSelfdefNvQuery, MpBmSelfdefWeightQueryByPage } from './service';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';
import moment from 'moment';

interface PropsType {
  customBenchmark: any;
  customMpdomain: any;
}

// 自定义基准
const CustomBenchmark = (props: PropsType) => {
  const { customBenchmark, customMpdomain } = props;
  const actionRef = useRef<ActionType>();
  const [nv, setNv] = useState<any>('');

  const request = async (params?: any) => {
    if (params.bmName) {
      const resultNv = await MpBmSelfdefNvQuery({
        bmCode: params.bmName,
        domain: params.domain,
        tradeDate: params.tradeDate?.replace(/-/g, ''),
        bmType: 3,
      });
      if (resultNv?.length) {
        setNv(resultNv[0]?.netValue);
      } else {
        setNv('');
      }
    } else {
      setNv('');
    }

    const result = await MpBmSelfdefWeightQueryByPage({
      current: params.current,
      pageSize: params.pageSize,
      bmCode: params.bmName,
      domain: params.domain,
      tradeDate: params.tradeDate?.replace(/-/g, ''),
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
        hideInTable: true,
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
        title: '股票代码',
        ellipsis: true,
        dataIndex: 'stkCode',
        hideInSearch: true,
      },
      {
        title: '股票名称',
        ellipsis: true,
        dataIndex: 'stkName',
        hideInSearch: true,
      },
      {
        title: '股票权重',
        ellipsis: true,
        dataIndex: 'weight',
        hideInSearch: true,
      },
      {
        title: '股票市值',
        ellipsis: true,
        dataIndex: 'marketValue',
        hideInSearch: true,
      },
      {
        title: '清算日期',
        ellipsis: true,
        dataIndex: 'tradeDate',
        valueType: 'date',
        initialValue: moment().add(-1, 'days').format('YYYY-MM-DD'), //当前时间后一天
      },
    ];
  }, [customBenchmark, customMpdomain]);

  return (
    <ProCard ghost direction="column" gutter={[0, cardGutter]}>
      <ProTable<TableListItem>
        headerTitle={`基准净值：${nv}`}
        actionRef={actionRef}
        rowKey={`${+new Date() + Math.random()}`}
        size="small"
        search={{ labelWidth: 'auto' }}
        columnEmptyText={false}
        form={{ ignoreRules: false }}
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
