import React, { useMemo, useCallback } from 'react';
import { useParams, history } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { getBondByCompanyCode } from '../service';
import styles from '../index.less';

const IssuanceBonds: React.FC<any> = ({}) => {
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

      const { data } = await getBondByCompanyCode(requestParams);

      return {
        ...data,
      };
    },
    [pramas],
  );

  const onNavigateClick = (bondCode: any) => () => {
    history.push(`/information/priceChanges/couponAfter/${bondCode}`);
  };

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '债券代码',
        align: 'left',
        dataIndex: 'bondCode',
        hideInSearch: true,
        hideInForm: true,
        width: 150,
      },
      {
        title: '债券简称',
        align: 'left',
        dataIndex: 'bondShortName',
        hideInSearch: true,
        hideInForm: true,
        width: 200,
        renderText: (text, record) => {
          return (
            <div className={styles['normal-point']} onClick={onNavigateClick(record?.bondCode)}>
              {text}
            </div>
          );
        },
      },
      {
        title: '债项评级',
        align: 'left',
        dataIndex: 'bondRating',
        hideInSearch: true,
        hideInForm: true,
        width: 150,
      },
      {
        title: '剩余期限（年）',
        align: 'left',
        dataIndex: 'remainingMaturity',
        hideInSearch: true,
        hideInForm: true,
        width: 200,
      },
      {
        title: '票面利率（%）',
        align: 'right',
        dataIndex: 'couponRate',
        hideInSearch: true,
        hideInForm: true,
        width: 200,
      },
    ];
  }, []);

  return (
    <ProCardPlus
      title="发行债券"
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

export default IssuanceBonds;
