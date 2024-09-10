import React, { useMemo, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { ActionType } from '@ant-design/pro-table';
import type { TableListItem } from './service';
import { MpBmComplexNvQuery, MpBmComplexQueryWithCloseByPage } from './service';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import moment from 'moment';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';

interface PropsType {
  mpBenchmarkDic: any;
  domainDic: any;
}

// 复合基准
const Benchmarks = (props: PropsType) => {
  const { mpBenchmarkDic, domainDic } = props;
  const actionRef = useRef<ActionType>();

  const [nv, setNv] = useState<any>('');

  const request = async (params?: any) => {
    if (params.bmName) {
      const resultNv = await MpBmComplexNvQuery({
        bmCode: params.bmName,
        domain: params.domain,
        tradeDate: params.tradeDate?.replace(/-/g, ''),
        bmType: 2,
      });
      if (resultNv.length) {
        setNv(resultNv[0].netNav);
      } else {
        setNv('');
      }
    } else {
      setNv('');
    }

    const result = await MpBmComplexQueryWithCloseByPage({
      bmCode: params.bmName,
      domain: params.domain,
      tradeDate: params.tradeDate?.replace(/-/g, ''),
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
        valueType: 'select',
        hideInSearch: true,
      },
      {
        title: '指数名称',
        ellipsis: true,
        dataIndex: 'indexName',
        valueType: 'select',
        hideInSearch: true,
      },
      {
        title: '指数权重(%)',
        ellipsis: true,
        dataIndex: 'weight',
        hideInSearch: true,
      },
      {
        title: '指数净值',
        ellipsis: true,
        dataIndex: 'close',
        hideInSearch: true,
      },
      {
        title: '指数发行公司',
        dataIndex: 'indexSysName',
        hideInSearch: true,
      },
      {
        title: '净值日期',
        ellipsis: true,
        dataIndex: 'tradeDate',
        valueType: 'date',
        initialValue: moment().add(-1, 'days').format('YYYY-MM-DD'), // 当前时间后一天
      },
    ];
  }, [mpBenchmarkDic, domainDic]);

  return (
    <ProCard ghost direction="column" gutter={[0, cardGutter]}>
      <ProTable
        headerTitle={`基准净值：${nv}`}
        actionRef={actionRef}
        rowKey={`${+new Date() + Math.random()}`}
        size="small"
        search={{ labelWidth: 'auto' }}
        request={request}
        columns={columns}
        pagination={{ current: 1, pageSize: 10 }}
        options={{ density: false }}
      />
    </ProCard>
  );
};

Benchmarks.isProCard = true;

export default Benchmarks;
