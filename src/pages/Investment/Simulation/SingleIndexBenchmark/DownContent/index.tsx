import React, { useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListItem2 } from '../service';
import { MpBmMarketIndexNvQuery, MpBmMarketIndexNvQueryWithCloseByPage } from '../service';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';
import moment from 'moment';

interface PropsType {
  domainDic: any;
  sigleBenchmarkDic: any;
}

// 单市场基准
const SingleIndexBenchmark = (props: PropsType) => {
  const { domainDic, sigleBenchmarkDic } = props;
  const actionRef = useRef<ActionType>();

  const [nv, setNv] = useState<any>('');

  const request = async (params?: any) => {
    if (params.indexName) {
      const resultNv = await MpBmMarketIndexNvQuery({
        indexCode: params.indexName,
        domain: params.domain,
        tradeDate: params.tradeDate?.replace('-', '')?.replace('-', ''),
        bmType: 1,
      });
      if (resultNv.length) {
        setNv(resultNv[0].close);
      } else {
        setNv('');
      }
    } else {
      setNv('');
    }

    const result = await MpBmMarketIndexNvQueryWithCloseByPage({
      current: params.current,
      pageSize: params.pageSize,
      domain: params.domain,
      indexCode: params.indexName,
      tradeDate: params.tradeDate?.replace('-', '')?.replace('-', ''),
      bmType: 1,
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

  const columns: ProColumns<TableListItem2>[] = useMemo(() => {
    return [
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
        valueType: 'select',
        valueEnum: ProTableHandle.toValueEnum(sigleBenchmarkDic, 'label', 'value'),
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
        title: '收盘价',
        ellipsis: true,
        dataIndex: 'close',
        hideInSearch: true,
      },
      {
        title: '指数分类路径',
        ellipsis: true,
        width: '20%',
        dataIndex: 'indexClassPath',
        hideInSearch: true,
      },
      {
        title: '指数发行公司',
        dataIndex: 'indexSysName',
        hideInSearch: true,
      },
      {
        title: '日期',
        dataIndex: 'tradeDate',
        valueType: 'date',
        initialValue: moment().add(-1, 'days').format('YYYY-MM-DD'), // 当前时间后一天
      },
    ];
  }, [domainDic, sigleBenchmarkDic]);

  return (
    <ProCard ghost direction="column" gutter={[0, cardGutter]}>
      <ProTable<TableListItem2>
        headerTitle={`基准净值：${nv}`}
        actionRef={actionRef}
        columnEmptyText={false}
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

SingleIndexBenchmark.isProCard = true;

export default SingleIndexBenchmark;
