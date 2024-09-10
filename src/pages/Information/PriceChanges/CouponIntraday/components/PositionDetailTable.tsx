import React, { useMemo, useCallback } from 'react';
import { useParams } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { COLORENUM, ITableItemType } from '../data.d';
import ProCardPlus from '@/components/ProCardPlus';
import { getBondThfundHold } from '../service';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export const sorterOpition = {
  holdRatio: '持仓比例',
  totalBondEstimateHoldEval: '持仓市值',
  totalAsset: '规模(亿)',
};

const PositionDetailTable: React.FC<any> = ({}) => {
  const pramas = useParams<{ id: string }>(); //TODO

  // 解构请求参数
  const reloadDataSource = useCallback(
    async (params, sort) => {
      const requestParams: any = {
        bondCode: pramas?.id,
      };
      Object.keys(params).forEach((item) => {
        switch (item) {
          case 'current': // 成交量
            requestParams['pageNum'] = params?.current;
            break;
          default:
            requestParams[item] = params[item];
            break;
        }
      });

      if (Object.keys(sort)?.length > 0) {
        const [[key, value]] = Object.entries(sort as any);
        requestParams['orderName'] = sorterOpition?.[key];
        if (value === 'descend') {
          requestParams['order'] = 'desc';
        } else if (value === 'ascend') {
          requestParams['order'] = 'asc';
        }
      }

      delete requestParams?.current;

      const { data } = await getBondThfundHold(requestParams);

      return {
        ...data,
      };
    },
    [pramas],
  );

  const columns: ProColumns<ITableItemType>[] = useMemo(() => {
    return [
      {
        title: '产品代码',
        align: 'left',
        dataIndex: 'fundCode',
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: '产品简称',
        align: 'left',
        dataIndex: 'fundName',
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: '产品类型',
        align: 'left',
        dataIndex: 'fundTypeName',
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: '基金类型',
        align: 'left',
        dataIndex: 'fundInvestTypeName',
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: (
          <>
            <span style={{ color: COLORENUM.red6 }}>持仓比例（%）</span>
            <Tooltip
              placement="top"
              title={'持仓比例：占基金净值比例，原始数据精度保留四位小数，百分比后精度保留两位小数'}
            >
              <QuestionCircleOutlined style={{ marginInlineStart: 4 }} />
            </Tooltip>
          </>
        ),
        align: 'right',
        dataIndex: 'holdRatio',
        hideInSearch: true,
        hideInForm: true,
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: <span style={{ color: COLORENUM.red6 }}>持仓市值（元）</span>,
        align: 'right',
        dataIndex: 'totalBondEstimateHoldEval',
        hideInSearch: true,
        hideInForm: true,
        sorter: true,
      },
      {
        title: '规模(亿)',
        align: 'right',
        dataIndex: 'totalAsset',
        hideInSearch: true,
        hideInForm: true,
      },
    ];
  }, []);

  return (
    <ProCardPlus
      title="机构持仓"
      bodyStyle={{
        paddingTop: 0,
      }}
    >
      <ProTable
        toolBarRender={false}
        search={false}
        columns={columns}
        size="small"
        rowKey={(_, index?: number) => `${index}`}
        request={async (params, sort) => {
          const { data, total } = await reloadDataSource(params, sort);
          return {
            data: data,
            total: total,
          };
        }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </ProCardPlus>
  );
};

export default PositionDetailTable;
