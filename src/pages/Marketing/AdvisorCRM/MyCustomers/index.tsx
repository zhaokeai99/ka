import useAuth from '@/components/Hooks/useAuth';
import ProCardPlus from '@/components/ProCardPlus';
import styles from './../index.less';
import { emptyToUndefined } from '@/pages/Marketing/AdvisorCRM/util';
import { contentPadding } from '@/themes';
import { qfw } from '@/utils/utils';
import { ProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { queryFinancialAdvisorCustomerList } from './service';
import { Link } from 'umi';

const DIRECT_TRANSFER = {
  ascend: 'asc',
  descend: 'desc',
};

const defaultColumns: any[] = [
  {
    title: (
      <span className={styles['nowrapBlock']} style={{ width: '70px' }}>
        客户姓名
      </span>
    ),
    dataIndex: 'userName',
    render: (text: any, record: any) => {
      return (
        <Link to={`/marketing/advisorCRM/customerQuery?thUserId=${record.thUserId}`}>{text}</Link>
      );
    },
  },
  {
    title: (
      <span className={styles['nowrapBlock']} style={{ width: '70px' }}>
        别名
      </span>
    ),
    dataIndex: 'userAlias',
    search: false,
  },
  {
    title: '手机后3位',
    dataIndex: 'mobileAfter3No',
    hideInTable: true,
  },
  {
    title: (
      <span className={styles['nowrapBlock']} style={{ width: '65px' }}>
        手机号
      </span>
    ),
    dataIndex: 'mobileNo',
    search: false,
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span className={styles['nowrapBlock']} style={{ marginRight: '5px' }}>
          持仓总资产
        </span>
        <span className={styles['selfFontIcon'] + ' ' + styles['backgroundColorGreen']}>直</span>
      </div>
    ),
    dataIndex: 'totalAssetsDirect',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span className={styles['nowrapBlock']} style={{ marginRight: '5px' }}>
          持仓总资产
        </span>
        <span className={styles['selfFontIcon']}>全</span>
      </div>
    ),
    dataIndex: 'totalAssetsAll',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span className={styles['nowrapBlock']} style={{ marginRight: '5px' }}>
          非货资产
        </span>
        <span className={styles['selfFontIcon'] + ' ' + styles['backgroundColorGreen']}>直</span>
      </div>
    ),
    dataIndex: 'nonMonetaryAssetsDirect',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span className={styles['nowrapBlock']} style={{ marginRight: '5px' }}>
          非货资产
        </span>
        <span className={styles['selfFontIcon']}>全</span>
      </div>
    ),
    dataIndex: 'nonMonetaryAssetsAll',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span style={{ marginRight: '5px', width: '60px' }}>今年非货净增资产</span>
        <span
          className={styles['selfFontIcon'] + ' ' + styles['backgroundColorGreen']}
          style={{ marginTop: '11px' }}
        >
          直
        </span>
      </div>
    ),
    dataIndex: 'thisYearNonMonetaryIncAssetsDirect',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span style={{ marginRight: '5px', width: '60px' }}>今年非货净增份额</span>
        <span
          className={styles['selfFontIcon'] + ' ' + styles['backgroundColorGreen']}
          style={{ marginTop: '11px' }}
        >
          直
        </span>
      </div>
    ),
    dataIndex: 'thisYearNonMonetaryIncShareDirect',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span style={{ marginRight: '5px', width: '72px' }}>近七日非货净增资产</span>
        <span
          className={styles['selfFontIcon'] + ' ' + styles['backgroundColorGreen']}
          style={{ marginTop: '11px' }}
        >
          直
        </span>
      </div>
    ),
    dataIndex: 'weekNonMonetaryIncAssetsDirect',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span style={{ marginRight: '5px', width: '72px' }}>近七日非货净增份额</span>
        <span
          className={styles['selfFontIcon'] + ' ' + styles['backgroundColorGreen']}
          style={{ marginTop: '11px' }}
        >
          直
        </span>
      </div>
    ),
    dataIndex: 'weekNonMonetaryIncShareDirect',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span className={styles['nowrapBlock']} style={{ marginRight: '5px' }}>
          历史资产峰值
        </span>
        <span className={styles['selfFontIcon'] + ' ' + styles['backgroundColorGreen']}>直</span>
      </div>
    ),
    dataIndex: 'hisAssetPeakDirect',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <div className={styles['displayFlex']}>
        <span className={styles['nowrapBlock']} style={{ marginRight: '5px' }}>
          历史资产峰值
        </span>
        <span className={styles['selfFontIcon']}>全</span>
      </div>
    ),
    dataIndex: 'hisAssetPeakAll',
    search: false,
    sorter: true,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <span className={styles['nowrapBlock']} style={{ width: '70px' }}>
        常用登录地
      </span>
    ),
    dataIndex: 'commonLoginAddress',
    search: false,
    renderText: (text: any) => {
      return qfw(text, '');
    },
  },
  {
    title: (
      <span className={styles['nowrapBlock']} style={{ width: '65px' }}>
        appUserId
      </span>
    ),
    dataIndex: 'appUserId',
  },
  {
    title: (
      <span className={styles['nowrapBlock']} style={{ width: '200px' }}>
        客户编号
      </span>
    ),
    dataIndex: 'thUserId',
    search: false,
  },
];

const MyCustomers: React.FC<any> = () => {
  const [selectCustomerColumns, setSelectCustomerColumns] = useState<any[]>(defaultColumns);

  let headerTitle = '我的客户';
  const show = useAuth({ sn: '123123123' });
  if (show) {
    headerTitle = '全部客户';
    setSelectCustomerColumns([
      {
        title: '理财顾问',
        dataIndex: 'advisorId',
        width: 30,
        hideInTable: false,
      },
      ...defaultColumns,
    ]);
  }
  return (
    <ProCardPlus
      sn={'_marketing_advisorCRM_myCustomers'}
      direction="column"
      style={{ padding: contentPadding }}
      ghost
      size="small"
      className={styles['crmSelfTable']}
    >
      <ProTable<any>
        headerTitle={headerTitle}
        style={{ backgroundColor: '#FFF', padding: '0 12px 24px 12px' }}
        columns={selectCustomerColumns}
        bordered={true}
        options={false}
        rowKey={'thUserId'}
        manualRequest={true}
        scroll={{ x: '110%' }}
        request={async (params, sort) => {
          const sortKeys = Object.keys(sort);
          const orderBy = sortKeys.length === 0 ? undefined : sortKeys[0];
          const direct = orderBy === undefined ? undefined : sort[orderBy];
          const advisorCustomerListResult = await queryFinancialAdvisorCustomerList({
            adviserId: emptyToUndefined(params?.adviserId),
            userName: emptyToUndefined(params?.userName),
            mobileAfter3No: emptyToUndefined(params?.mobileAfter3No),
            appUserId: emptyToUndefined(params?.appUserId),
            isAdministrator: show,
            orderBy: orderBy,
            orderDirect: direct ? DIRECT_TRANSFER[direct] : undefined,
            pageNum: params?.current,
            pageSize: params?.pageSize,
          });
          return {
            data: advisorCustomerListResult.data,
            total: advisorCustomerListResult.total,
            success: true,
          };
        }}
        pagination={{
          defaultPageSize: 30,
          pageSizeOptions: [30, 50, 75, 100],
          showSizeChanger: true,
        }}
      ></ProTable>
    </ProCardPlus>
  );
};

export default MyCustomers;
