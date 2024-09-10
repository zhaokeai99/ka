import React, { useMemo, useCallback, useState } from 'react';
import { useParams } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { ITableItemType } from '../data.d';
import ProCardPlus from '@/components/ProCardPlus';
import { getBondAmountChange } from '../service';
import { primaryColor } from '@/themes';

const sorterOpition = {};

const RepayInfoTable: React.FC<any> = ({}) => {
  const pramas = useParams<{ id: string }>(); //TODO

  const [dataLength, setDataLength] = useState(null);

  // 解构请求参数
  const reloadDataSource = useCallback(
    async (params, sort) => {
      const requestParams: any = {
        code: pramas?.id,
      };
      Object.keys(params).forEach((item) => {
        switch (item) {
          case 'current':
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

      const { data } = await getBondAmountChange(requestParams);

      if (data?.length) {
        const length: any = data?.length - 1;
        setDataLength(length);
      }

      return {
        data,
      };
    },
    [pramas],
  );

  const columns: ProColumns<ITableItemType>[] = useMemo(() => {
    return [
      {
        title: '日期',
        align: 'left',
        dataIndex: 'endDate',
        hideInSearch: true,
        hideInForm: true,
        render: (text, _, index) => {
          let style: React.CSSProperties = {
            color: '#000000',
          };
          if (index === 0) {
            style = {
              color: primaryColor,
              fontWeight: 600,
            };
          } else if (index === dataLength) {
            style = {
              color: primaryColor,
              fontWeight: 600,
            };
          }
          return <span style={{ ...style }}>{text}</span>;
        },
      },
      {
        title: '债券余额（万）',
        align: 'right',
        dataIndex: 'balanceAmt',
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: '债券票面（元）',
        align: 'right',
        dataIndex: 'par',
        hideInSearch: true,
        hideInForm: true,
      },
      {
        title: '已偿本金占比（%）',
        align: 'right',
        dataIndex: 'repayPriRate',
        hideInSearch: true,
        hideInForm: true,
      },
    ];
  }, [dataLength]);

  return (
    <ProCardPlus
      title="偿还信息"
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
          const { data } = await reloadDataSource(params, sort);
          return {
            data: data,
          };
        }}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </ProCardPlus>
  );
};

export default RepayInfoTable;
