import React, { useMemo, useCallback } from 'react';
import { useParams, history } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { getStockInfoByCompanyCode } from '../service';
import styles from '../index.less';

const IssuanceStock: React.FC<any> = ({}) => {
  const pramas = useParams<{ id: string }>(); //TODO

  // 解构请求参数
  const reloadDataSource = useCallback(
    async (params) => {
      const requestParams: any = {
        code: pramas?.id,
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

      delete requestParams?.current;

      const { data } = await getStockInfoByCompanyCode(requestParams);

      return {
        ...data,
      };
    },
    [pramas],
  );

  const onNavigateClick = (windStockCode: any, stockName: any) => () => {
    history.push(`/information/priceChanges/stockDetail/${stockName}/${windStockCode}`);
  };

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '股票代码',
        align: 'left',
        dataIndex: 'windStockCode',
        hideInSearch: true,
        hideInForm: true,
        width: 150,
      },
      {
        title: '股票简称',
        align: 'left',
        dataIndex: 'stockName',
        hideInSearch: true,
        hideInForm: true,
        width: 200,
        renderText: (text, record) => {
          return (
            <div
              className={styles['normal-point']}
              onClick={onNavigateClick(record?.windStockCode, record?.stockName)}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: '交易所',
        align: 'left',
        dataIndex: 'marketTypeName',
        hideInSearch: true,
        hideInForm: true,
        width: 150,
      },
      {
        title: '上市板',
        align: 'left',
        dataIndex: 'listBoardName',
        hideInSearch: true,
        hideInForm: true,
        width: 200,
      },
      {
        title: '证券类型',
        align: 'left',
        dataIndex: 'stockType',
        hideInSearch: true,
        hideInForm: true,
        width: 200,
      },
    ];
  }, []);

  return (
    <ProCardPlus
      title="发行股票"
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
        request={async (params) => {
          const { data, total } = await reloadDataSource(params);
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

export default IssuanceStock;
