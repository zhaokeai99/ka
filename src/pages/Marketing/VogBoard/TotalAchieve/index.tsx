import ProCardPlus from '@/components/ProCardPlus';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Spin } from 'antd';
import { useContext, useEffect, useState } from 'react';
import MyProgress from '../MyProgress';
import {
  queryVogOverview,
  queryVogWithPdept,
  queryVogWithSpecialAccount,
  VogProvider,
} from '../service';
import Title from '../Title';
import VogCard from '../VogCard';
// import VogCardGroup from '../VogCardGroup';
import styles from './index.less';
import Total from './Total';

// 整体达成模块
const TotalAchieve = () => {
  const vogParams = useContext<any>(VogProvider);
  const [totalInfo, setTotalInfo] = useState({
    assetAmtTotal: '',
    assetAddTotal: '',
    fundCountTotal: '',
  });
  const [cardList, setCardList] = useState<any[]>([]);
  const [cardLoading, setCardLoading] = useState(false);

  // 部门达成 columns
  const branchColumn: ProColumns<any, 'BIFundColor'>[] = [
    {
      title: '部门',
      dataIndex: 'pdeptName',
      key: 'pdeptName',
      fixed: 'left',
      render: (text) => <a onClick={() => message.warn('页面正在建设中~')}>{text}</a>,
    },
    {
      title: '流入(万)',
      dataIndex: 'buyAmt',
      key: 'buyAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '流出(万)',
      dataIndex: 'sellAmt',
      key: 'sellAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '净流入(万)',
      dataIndex: 'netBuyAmt',
      key: 'netBuyAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '区间保有净增（亿）',
      dataIndex: 'assetAdd',
      key: 'assetAdd',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '存量规模(亿)',
      dataIndex: 'assetAmt',
      key: 'assetAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '年目标值(亿)',
      dataIndex: 'vogTarget',
      key: 'vogTarget',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '年完成率',
      dataIndex: 'vogRatio',
      key: 'vogRatio',
      align: 'center',
      render: (text: any) => {
        const percent = Number((text * 100).toFixed(2));
        return (
          <div style={{ width: '120px', margin: '0 auto' }}>
            <MyProgress width="60px" percent={percent || 0} showIcon={false} showLabel={false} />
          </div>
        );
      },
    },
  ];

  // 专户专项 columns
  const specialColumn: ProColumns<any, 'BIFundColor'>[] = [
    {
      title: '部门',
      dataIndex: 'pdeptName',
      key: 'pdeptName',
      fixed: 'left',
      render: (text) => <a onClick={() => message.warn('页面正在建设中~')}>{text}</a>,
    },
    {
      title: '产品类型',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '流入(万)',
      dataIndex: 'buyAmt',
      key: 'buyAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '流出(万)',
      dataIndex: 'sellAmt',
      key: 'sellAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '净流入(万)',
      dataIndex: 'netBuyAmt',
      key: 'netBuyAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '区间保有净增（亿）',
      dataIndex: 'assetAdd',
      key: 'assetAdd',
      align: 'right',
      valueType: 'BIFundColor',
    },
    {
      title: '存量规模(亿)',
      dataIndex: 'assetAmt',
      key: 'assetAmt',
      align: 'right',
      valueType: 'BIFundColor',
    },
  ];

  // 整体达成
  useEffect(() => {
    (async () => {
      if (JSON.stringify(vogParams) === '{}' || !vogParams?.startDate) return;
      setCardLoading(true);
      const result = await queryVogOverview(vogParams);
      setTotalInfo({
        assetAddTotal: result?.assetAddTotal || '--',
        assetAmtTotal: result?.assetAmtTotal || '--',
        fundCountTotal: result?.fundCountTotal || '--',
      });
      setCardLoading(false);
      setCardList(result?.typeList || []);
    })();
  }, [vogParams]);

  // 部门达成: 'PDEPT'、专户专项业绩: 'SPECIAL'
  const queryTableList: any = async (p: any, type: string) => {
    if (JSON.stringify(p) !== '{}' && p?.startDate) {
      return type === 'PDEPT'
        ? await queryVogWithPdept({ ...p })
        : await queryVogWithSpecialAccount({ ...p });
    }
    return {};
  };

  return (
    <ProCardPlus ghost direction="column" style={{ padding: 16, backgroundColor: '#fff' }}>
      <Title id="totalAchieve" title="整体达成" />
      <Total loading={cardLoading} data={totalInfo} />
      <Spin spinning={cardLoading}>
        <VogCard data={cardList} selectable={false} />
      </Spin>
      <Title id="keyIndicators" style={{ marginTop: '20px' }} title="重点指标" />
      <ProTable
        rowKey="pdeptId"
        className={styles['table']}
        headerTitle="部门达成（非货公募）"
        tooltip="因考核数据会受报备的影响而发生变动，体系和部门维度的考核数据仅反应当前时点的情况"
        request={(p: any) => queryTableList(p, 'PDEPT')}
        pagination={false}
        params={vogParams}
        options={false}
        search={false}
        columns={branchColumn}
        scroll={{ x: 'max-content' }}
      />
      <ProTable
        rowKey="pdeptId"
        style={{ marginTop: '20px' }}
        className={styles['table']}
        request={(p: any) => queryTableList(p, 'SPECIAL')}
        pagination={false}
        params={vogParams}
        headerTitle="专户专项业绩"
        options={false}
        search={false}
        columns={specialColumn}
        scroll={{ x: 'max-content' }}
      />
    </ProCardPlus>
  );
};

TotalAchieve.isProCard = true;

export default TotalAchieve;
