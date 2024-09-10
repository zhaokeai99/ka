import ProCardPlus from '@/components/ProCardPlus';
import { transOptions } from '@/utils/utils';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Radio, Spin } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  querySecondCardList,
  querySellInfoByFund,
  queryVogWithFundVogType,
  queryVogWithPdept,
  VogProvider,
} from '../service';
import Title from '../Title';
import VogCard from '../VogCard';
// import VogCardGroup from '../VogCardGroup';
import styles from './index.less';

// 非货公募产品排行模块
const FundRank = () => {
  const vogParams = useContext<any>(VogProvider);
  const cardRef = useRef<any>();
  const secondCardRef = useRef<any>();
  const [radioOpt, setRadioOpt] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [orderType, setOrderType] = useState<any>('');
  const [orderColumn, setOrderColumn] = useState<any>('');
  const [fundVogType, setFundVogType] = useState('');
  const [fundCustomVogName, setFundCustomVogName] = useState('');
  const [pdeptId, setPdeptId] = useState('');
  const [cardList, setCardList] = useState([]);
  const [secondCardList, setSecondCardList] = useState([]);
  const [cardLoading, setCardLoading] = useState(false);

  const tableColumn: ProColumns<any, 'BIFundColor'>[] = [
    {
      title: '排名',
      key: 'rank',
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + (index + 1),
    },
    {
      title: '业务部门',
      dataIndex: 'pdeptName',
      key: 'pdeptName',
    },
    {
      title: '产品一级类型',
      dataIndex: 'fundVogName',
      key: 'fundVogName',
    },
    {
      title: '产品二级类型',
      dataIndex: 'fundCustomVogName',
      key: 'fundCustomVogName',
    },
    {
      title: '基金产品',
      dataIndex: 'fundName',
      key: 'fundName',
      render: (text: any, record: any) => (
        <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
          {text}
        </a>
      ),
    },
    {
      title: '基金代码',
      dataIndex: 'fundCode',
      key: 'fundCode',
    },
    {
      title: '流入(万)',
      dataIndex: 'buyAmt',
      key: 'buyAmt',
      align: 'right',
      sorter: true,
      sortOrder: orderColumn === 'buyAmt' && orderType,
      // valueType: 'BIFundColor',
    },
    {
      title: '流出(万)',
      dataIndex: 'sellAmt',
      key: 'sellAmt',
      align: 'right',
      sorter: true,
      sortOrder: orderColumn === 'sellAmt' && orderType,
      // valueType: 'BIFundColor',
    },
    {
      title: '净流入(万)',
      dataIndex: 'netBuyAmt',
      key: 'netBuyAmt',
      align: 'right',
      sorter: true,
      sortOrder: orderColumn === 'netBuyAmt' && orderType,
      // valueType: 'BIFundColor',
    },
    {
      title: '存量规模(万)',
      dataIndex: 'assetAmt',
      key: 'assetAmt',
      align: 'right',
      sorter: true,
      sortOrder: orderColumn === 'assetAmt' && orderType,
      // valueType: 'BIFundColor',
    },
    {
      title: '区间保有净增(万)',
      dataIndex: 'assetAdd',
      key: 'assetAdd',
      align: 'right',
      sorter: true,
      sortOrder: orderColumn === 'assetAdd' && orderType,
      // valueType: 'BIFundColor',
    },
    // {
    //   title: '持有用户数',
    //   dataIndex: '',
    //   key: '',
    // },
    // {
    //   title: '累计收益',
    //   dataIndex: '',
    //   key: '',
    // },
  ];

  // 重置排序
  const resetOrderInfo = () => {
    setOrderType('');
    setOrderColumn('');
  };

  // 查询 Radio 数据
  useEffect(() => {
    (async () => {
      if (JSON.stringify(vogParams) === '{}' || !vogParams?.startDate) return;
      const result = await queryVogWithPdept({ ...vogParams });
      const options = transOptions(result?.data, 'pdeptName', 'pdeptId', false);
      setRadioOpt(options);
    })();
    // 重置排序信息
    resetOrderInfo();
    // 重置一级卡片
    cardRef?.current?.reload();
    // 重置二级卡片
    secondCardRef?.current?.reload();
    // 重置 Radio 选择
    setPdeptId('');
    // 重置一级卡片选择
    setFundVogType('');
    // 重置二级卡片选择
    setFundCustomVogName('');
  }, [vogParams]);

  // 非货公募产品排行-产品类型卡片
  useEffect(() => {
    (async () => {
      if (JSON.stringify(vogParams) === '{}' || !vogParams?.startDate) return;
      setCardLoading(true);
      const result = await queryVogWithFundVogType({
        ...vogParams,
        ...(pdeptId ? { pdeptId } : {}),
      });
      setCardLoading(false);
      setCardList(result);
    })();
  }, [vogParams, pdeptId]);

  // 查询列表数据
  const queryTableList: any = async (p: any) => {
    if (JSON.stringify(vogParams) === '{}' || !vogParams?.startDate) return;
    const { dateDur, startDate, endDate } = p || {};
    setCardLoading(true);
    const result = await querySellInfoByFund({
      dateDur,
      startDate,
      endDate,
      orderType: p.orderType === 'ascend' ? 'asc' : 'desc',
      orderColumn: p.orderColumn || 'buyAmt',
      page: 1,
      pageSize: 3000, // 后端要求，此处为前端分页
      ...(fundVogType ? { fundVogType: p.fundVogType } : {}),
      ...(pdeptId ? { pdeptId: p.pdeptId } : {}),
      ...(fundCustomVogName ? { fundCustomVogName: p.fundCustomVogName } : {}),
    });
    setCardLoading(false);
    return result;
  };

  // 二级卡片列表查询
  const querySecondCard = async (val: any) => {
    const res = await querySecondCardList({
      ...vogParams,
      ...(pdeptId ? { pdeptId } : {}),
      fundVogType: val,
    });
    setSecondCardList(res);
  };

  // 一级卡片change
  const cardChange = (val: any) => {
    resetOrderInfo();
    setFundCustomVogName('');
    setFundVogType(val);
    // 清空二级卡片选择
    secondCardRef?.current?.reload();
    // 查询二级卡片list
    querySecondCard(val);
  };

  // 二级卡片change
  const custumCardChange = (val: any) => {
    resetOrderInfo();
    setFundCustomVogName(val);
  };

  return (
    <ProCardPlus
      ghost
      direction="column"
      style={{ padding: 16, backgroundColor: '#fff' }}
      id="fundRank"
    >
      <Title
        style={{ marginBottom: '20px' }}
        title="非货公募产品排行"
        extra={
          <Radio.Group
            defaultValue=""
            value={pdeptId}
            size="middle"
            onChange={(val: any) => {
              cardRef?.current?.reload();
              secondCardRef?.current?.reload();
              resetOrderInfo();
              setFundVogType('');
              setFundCustomVogName('');
              setPdeptId(val.target.value);
            }}
          >
            <Radio.Button value="">全部</Radio.Button>
            {radioOpt?.map((i: any) => (
              <Radio.Button key={i.value} value={i.value}>
                {i.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        }
      />
      <Spin spinning={cardLoading}>
        <VogCard
          onCardChange={cardChange}
          progressWidth="38%"
          cardType="Rank"
          wrapEachWidth="19%"
          data={cardList}
          ref={cardRef}
        />

        {fundVogType && secondCardList && secondCardList?.length > 0 && (
          <ProCardPlus
            ghost
            style={{ backgroundColor: '#f5f5f5', marginTop: '16px', padding: '10px' }}
          >
            <div className={styles['second-vog-card-container']}>
              <VogCard
                onCardChange={custumCardChange}
                progressWidth="38%"
                cardType="Second"
                data={secondCardList}
                ref={secondCardRef}
                wrap={false}
              />
            </div>
          </ProCardPlus>
        )}
      </Spin>
      <ProTable
        rowKey="pdeptId"
        style={{ marginTop: '20px' }}
        className={styles['table']}
        options={false}
        search={false}
        columns={tableColumn}
        scroll={{ x: 'max-content' }}
        params={{ ...vogParams, pdeptId, fundVogType, fundCustomVogName, orderType, orderColumn }}
        request={queryTableList}
        onChange={(_: any, __: any, sorter: any) => {
          const { columnKey, order, column } = sorter;
          setOrderType(order);
          setOrderColumn(column ? columnKey : '');
        }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (current: number, pageSize: number) => {
            setPagination({ current, pageSize });
          },
        }}
      />
    </ProCardPlus>
  );
};

FundRank.isProCard = true;

export default FundRank;
