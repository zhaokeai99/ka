import useProState from '@/components/Hooks/useProState';
import ProCardPlus from '@/components/ProCardPlus';
import { negativeColor, positiveColor } from '@/themes/index';
import { dealNumThousands, GUTTER_SIZE } from '@/utils/utils';
import { Area } from '@ant-design/charts';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Empty, Radio, Space, Tooltip } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import PickerComponent from '../../ChannelDistribution/PickerComponent';
import { HotFundListIndex, KeySalesListIndex } from '../data';
import { MyPieChart } from '../MyPieChart';
import {
  queryHotFundInfo,
  queryHotFundList,
  queryKeySalesFundList,
  querySalesCategoryInfo,
} from '../service';
import styles from './index.less';

// 非货公募相关模块
const NonMonetary: React.FC<{ fundType: any }> = ({ fundType = '' }) => {
  const initialDateValue = {
    dateDimension: '3',
    dateDur: moment().format('YYYY-MM'),
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
  };
  const [{ dateInfo }] = useModel('useMarketingModel');
  const [amountText, setAmountText] = useState('申购金额');
  const [hotPagination, setHotPagination] = useState({ current: 1, pageSize: 8 });
  const [keySalesPagination, setKeySalesPagination] = useState({ current: 1, pageSize: 6 });
  const [hotParams, setHotParams] = useProState({ ...initialDateValue });
  const [keySalesParams, setKeySalesParams] = useState({ ...initialDateValue });
  const [hotFundInfo, setHotFundInfo] = useProState<any>({
    purchaseCumCnt: { total: '', ratio: '' },
    purchaseCnt: { total: '', ratio: '' },
    avgPurchaseAmt: { total: '', ratio: '' },
    yField: '',
    chartsList: [],
  });
  const [keySalesInfo, setKeySalesInfo] = useProState<any>({
    purchaseAmt: { total: '', ratio: '' },
    redeemAmt: { total: '', ratio: '' },
    yField: '',
    chartsList: [],
  });
  const [chartType, setChartType] = useState<any>({
    hotFundType: 'purchaseCumCnt',
    keySalesType: 'purchaseAmt',
  });
  const [pieList, setPieList] = useState<any>({});
  const [pieType, setPieType] = useState('purchaseAmtInfo');
  const [categoryParams, seyCategoryParams] = useState({
    dateDimension: '1',
    dateDur: dateInfo.dLastT1Day,
  });
  const [channelType, setChannelType] = useState('');

  const categoryColumns = useMemo(
    () => [
      {
        title: '产品类型',
        dataIndex: 'fundTypeName',
        key: 'fundTypeName',
      },
      {
        title: `${amountText}（万）`,
        dataIndex: 'tradeAmt',
        key: 'tradeAmt',
        valueType: 'BIFundColor',
      },
      {
        title: '占比',
        dataIndex: 'tradeAmtRadio',
        key: 'tradeAmtRadio',
        valueType: 'BIFundColor',
      },
    ],
    [amountText],
  );

  const channelColumns: ProColumns<KeySalesListIndex, 'BIFundColor'>[] = useMemo(
    () => [
      {
        title: '渠道名称',
        dataIndex: 'agencyName',
        key: 'agencyName',
        // fixed: 'left',
        render: (_, item) => (
          <a
            rel="noopener noreferrer"
            href={`#/marketing/sellconfig/channelDistribution/detail/${item.agencyCode}`}
          >
            {_}
          </a>
        ),
      },
      {
        title: '申购金额（万）',
        dataIndex: 'purchaseAmt',
        key: 'purchaseAmt',
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回金额（万）',
        dataIndex: 'redeemAmt',
        key: 'redeemAmt',
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '净申购（万）',
        dataIndex: 'netAmt',
        key: 'netAmt',
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '年度保有净增（亿）',
        dataIndex: 'holdNetAmt',
        key: 'holdNetAmt',
        sorter: true,
        width: 160,
        hideInTable: keySalesParams.dateDimension !== '1',
        valueType: 'BIFundColor',
      },
      {
        title: '时点规模（亿）',
        dataIndex: 'stockAmt',
        key: 'stockAmt',
        sorter: true,
        width: 160,
        hideInTable: keySalesParams.dateDimension !== '1',
        valueType: 'BIFundColor',
      },
    ],
    [keySalesParams],
  );

  const hotFundColumns: ProColumns<HotFundListIndex, 'BIFundColor'>[] = useMemo(
    () => [
      {
        title: '产品名称',
        dataIndex: 'fundName',
        key: 'fundName',
        // fixed: 'left',
        render: (_, item) => (
          <a rel="noopener noreferrer" href={`#/production/index/newDetail/${item.fundCode}`}>
            {_}
          </a>
        ),
      },
      {
        title: '申购用户数',
        dataIndex: 'purchaseCumCnt',
        key: 'purchaseCumCnt',
        sorter: true,
      },
      {
        title: '申购用户数环比（%）',
        dataIndex: 'purchaseCumCntRadio',
        key: 'purchaseCumCntRadio',
        width: 160,
        valueType: 'BIFundColor',
      },
      {
        title: '申购（万）',
        dataIndex: 'purchaseAmt',
        key: 'purchaseAmt',
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回（万）',
        dataIndex: 'redeemAmt',
        key: 'redeemAmt',
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '净申购（万）',
        dataIndex: 'netAmt',
        key: 'netAmt',
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '时点规模（亿）',
        dataIndex: 'stockAmt',
        key: 'stockAmt',
        sorter: true,
        width: 160,
        hideInTable: hotParams.dateDimension !== '1',
        valueType: 'BIFundColor',
      },
      {
        title: '年增长（%）',
        dataIndex: 'yearHeadInr',
        key: 'yearHeadInr',
        sorter: true,
        width: 120,
        hideInTable: hotParams.dateDimension !== '1',
        valueType: 'BIFundColor',
      },
    ],
    [hotParams],
  );

  const pieConfig: any = useMemo(
    () => ({
      appendPadding: 15,
      angleField: 'tradeAmt',
      colorField: 'fundTypeName',
      radius: 1,
      innerRadius: 0.7,
      style: {
        height: '300px',
      },
      label: {
        content: (val: any) => {
          return `${Number(val.tradeAmt).toLocaleString()}万`;
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
      legend: {
        layout: 'column',
        position: 'left',
      },
      tooltip: {
        formatter: (value: any) => {
          return {
            name: value.fundTypeName,
            value: `${Number(value.tradeAmt).toLocaleString()}万`,
          };
        },
      },
      statistic: {
        title: false,
        content: {
          style: {
            fontSize: '18px',
          },
          customHtml: (_: any, _view: any, _datum: any, data: any) => {
            const amount = data.reduce((r: any, d: any) => r + d.tradeAmtDetail, 0) / 10000;
            const total = Math.floor(amount * 100) / 100;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '26px' }}>
                <span>{!!total ? Number(total).toLocaleString() : '--'}</span>
                <span>（万元）</span>
              </div>
            );
          },
        },
      },
    }),
    [pieList, pieType],
  );

  const keySalesConfig: any = useMemo(
    () => ({
      data: keySalesInfo.chartsList,
      appendPadding: 10,
      xField: 'natureDate',
      yField: keySalesInfo.yField,
      yAxis: {
        label: {
          formatter: (val: any) => dealNumThousands(val),
        },
      },
      smooth: true,
      meta: {
        purchaseAmt: {
          alias: '申购金额',
          formatter: (val: any) => `${Number(val).toLocaleString()}万`,
        },
        redeemAmt: {
          alias: '赎回金额',
          formatter: (val: any) => `${Number(val).toLocaleString()}万`,
        },
      },
      style: {
        height: '250px',
      },
      slider: {
        start: 0,
        end: 1,
      },
      areaStyle: { fill: 'l(270) 0:#F6F9FE 0.5:#D7E3FF 1:#8FB0FC' },
      line: { color: '#3277FC' },
    }),
    [keySalesInfo],
  );

  const hotFundConfig: any = useMemo(
    () => ({
      data: hotFundInfo.chartsList,
      appendPadding: 12,
      xField: 'natureDate',
      yField: hotFundInfo.yField,
      yAxis: {
        label: {
          formatter: (val: any) => dealNumThousands(val),
        },
      },
      smooth: true,
      meta: {
        purchaseCumCnt: {
          alias: '申购用户数',
          formatter: (val: any) => `${Number(val).toLocaleString()}万`,
        },
        purchaseCnt: {
          alias: '申购笔数',
          formatter: (val: any) => `${Number(val).toLocaleString()}万`,
        },
        avgPurchaseAmt: {
          alias: '人均申购金额',
          formatter: (val: any) => `${Number(val).toLocaleString()}万`,
        },
      },
      style: {
        height: '300px',
      },
      slider: {
        start: 0,
        end: 1,
      },
      areaStyle: { fill: 'l(270) 0:#F6F9FE 0.5:#D7E3FF 1:#8FB0FC' },
      line: { color: '#3277FC' },
    }),
    [hotFundInfo],
  );

  // 非货公募销售类别占比
  const querySalesCategory = useCallback(async () => {
    const { data } = await querySalesCategoryInfo({
      ...(channelType ? { agencyType: channelType } : {}),
      dateDimension: categoryParams.dateDimension,
      dateDur: categoryParams.dateDur,
    });
    setPieList({
      purchaseAmtInfo: data?.purchaseAmtInfo || [],
      redeemAmtInfo: data?.redeemAmtInfo || [],
    });
  }, [channelType, categoryParams]);

  // 非货公募热门产品-趋势图、申购环比
  const queryHotFund = useCallback(
    async (value: any, type: any) => {
      if (!value.dateDur) {
        if (type === 'HOT_FUND') {
          setHotFundInfo({
            purchaseCumCnt: { total: '', ratio: '' },
            purchaseCnt: { total: '', ratio: '' },
            avgPurchaseAmt: { total: '', ratio: '' },
            yField: '',
            chartsList: [],
          });
        } else {
          setKeySalesInfo({
            purchaseAmt: { total: '', ratio: '' },
            redeemAmt: { total: '', ratio: '' },
            yField: '',
            chartsList: [],
          });
        }
        return;
      }
      const res = await queryHotFundInfo({
        baseParams: {
          dateDimension: value?.dateDimension,
          dateDur: value?.dateDur,
          ...(fundType ? { fundType } : {}),
        },
        chartsParams: {
          startDate: value?.startDate,
          endDate: value?.endDate,
          ...(fundType ? { fundType } : {}),
        },
      });
      if (type === 'HOT_FUND') {
        setHotFundInfo({
          purchaseCumCnt: { total: res[0]?.purchaseCumCnt, ratio: res[0]?.purchaseCumCntRadio },
          purchaseCnt: { total: res[0]?.purchaseCnt, ratio: res[0]?.purchaseCntRadio },
          avgPurchaseAmt: { total: res[0]?.avgPurchaseAmt, ratio: res[0]?.avgPurchaseAmtRadio },
          yField: chartType.hotFundType,
          chartsList: res[1] || [],
        });
      } else {
        setKeySalesInfo({
          purchaseAmt: { total: res[0]?.purchaseAmt, ratio: res[0]?.purchaseAmtRadio },
          redeemAmt: { total: res[0]?.redeemAmt, ratio: res[0]?.redeemAmtRadio },
          yField: chartType.keySalesType,
          chartsList: res[1] || [],
        });
      }
    },
    [fundType],
  );

  // 非货公募重点销售渠道列表
  const queryKeySalesTableList = async (params: any, sorter: any) => {
    const { dateDimension, dateDur } = keySalesParams;
    if (!dateDur) return [];
    const { success, data } = await queryKeySalesFundList({
      page: params.current,
      pageSize: params.pageSize,
      dateDimension,
      dateDur,
      orderType: Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc',
      orderColumn: Object.keys(sorter)[0] || 'purchaseAmt',
      ...(fundType ? { fundType } : {}),
    });
    if (success) {
      setKeySalesPagination({ current: data.page, pageSize: data.pageSize });
    }
    return data;
  };

  // 非公募热门产品列表
  const queryHotFundTableList = async (params: any, sorter: any) => {
    const { dateDimension, dateDur } = hotParams;
    if (!dateDur) return [];
    const { success, data } = await queryHotFundList({
      page: params.current,
      pageSize: params.pageSize,
      dateDimension,
      dateDur,
      orderType: Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc',
      orderColumn: Object.keys(sorter)[0] || 'purchaseAmt',
      ...(fundType ? { fundType } : {}),
    });
    if (success) {
      setHotPagination({ current: data.page, pageSize: data.pageSize });
    }
    return data;
  };

  useEffect(() => {
    queryHotFund(hotParams, 'HOT_FUND');
  }, [hotParams, fundType]);

  useEffect(() => {
    queryHotFund(keySalesParams, 'KEY_SALES');
  }, [keySalesParams, fundType]);

  useEffect(() => {
    querySalesCategory();
  }, [categoryParams, channelType]);

  const changeHotCharts = useCallback((val: any) => {
    setHotFundInfo({ yField: val.target.value });
    setChartType({ ...chartType, hotFundType: val.target.value });
  }, []);

  const changeKeySalesCharts = useCallback((val: any) => {
    setKeySalesInfo({ yField: val.target.value });
    setChartType({ ...chartType, keySalesType: val.target.value });
  }, []);

  const labelText = useCallback((val: any) => {
    if (val === 'purchaseCumCnt') {
      return '申购用户数:';
    } else if (val === 'purchaseCnt') {
      return '申购笔数:';
    } else {
      return '人均申购金额';
    }
  }, []);

  const handleData = useCallback(
    (data: any = []) => {
      if (fundType) {
        return data.filter((i: any) => i.fundType === fundType);
      }
      return data;
    },
    [fundType],
  );

  return (
    <ProCardPlus ghost direction="column" gutter={[GUTTER_SIZE, GUTTER_SIZE]}>
      <ProCardPlus ghost direction="row" gutter={[GUTTER_SIZE, 0]}>
        <ProCardPlus
          style={{ height: '800px', backgroundColor: '#fff' }}
          title="非货公募重点销售渠道"
          colSpan={12}
          direction="column"
          ghost
          extra={
            <Tooltip placement="top" title="按照渠道维度，统计非货公募基金的累计申赎信息">
              <InfoCircleOutlined />
            </Tooltip>
          }
        >
          <ProCardPlus ghost direction="column">
            <div className={styles['sales-channel-conditions']}>
              <Radio.Group
                buttonStyle="solid"
                defaultValue="purchaseAmt"
                onChange={changeKeySalesCharts}
              >
                <Radio.Button value="purchaseAmt">申购金额</Radio.Button>
                <Radio.Button value="redeemAmt">赎回金额</Radio.Button>
              </Radio.Group>
              <PickerComponent
                onChange={(val: any) => setKeySalesParams(val)}
                initialType="3"
                initialDate={moment().format('YYYY-MM')}
              />
            </div>
            <Space style={{ fontSize: '16px', margin: '0 12px 12px' }}>
              <label>{chartType.keySalesType === 'purchaseAmt' ? '申购金额:' : '赎回金额'}</label>
              <span>{keySalesInfo[chartType.keySalesType].total}万&nbsp;&nbsp;</span>
              <label>环比数：</label>
              <span
                style={{
                  color: keySalesInfo[chartType.keySalesType].ratio?.startsWith('-')
                    ? negativeColor
                    : positiveColor,
                }}
              >
                {keySalesInfo[chartType.keySalesType].ratio}%
              </span>
            </Space>
            <ProCardPlus ghost>
              {!keySalesInfo.chartsList || keySalesInfo.chartsList.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Area {...keySalesConfig} />
              )}
            </ProCardPlus>
          </ProCardPlus>
          <ProTable<KeySalesListIndex>
            className={styles['card-table-style']}
            search={false}
            options={false}
            size="middle"
            rowKey="agencyCode"
            pagination={{ ...keySalesPagination, showSizeChanger: false }}
            scroll={{ x: 'max-content' }}
            columns={channelColumns}
            request={queryKeySalesTableList}
            params={{ ...keySalesParams, fundType }}
          />
        </ProCardPlus>
        <ProCardPlus
          ghost
          style={{ height: '800px', backgroundColor: '#fff' }}
          colSpan={12}
          direction="column"
          title="非货公募销售类别占比"
          extra={
            <Tooltip
              placement="left"
              title="按照产品投资类型和渠道类别维度，统计非货公募基金的累计申赎信息"
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
        >
          <ProCardPlus ghost direction="column" style={{ padding: '0 12px' }}>
            <div className={styles['params-container']}>
              <div className={styles['picker-style']}>
                <Radio.Group
                  defaultValue="purchaseAmtInfo"
                  buttonStyle="solid"
                  onChange={(val: any) => {
                    const text = val.target.value === 'purchaseAmtInfo' ? '申购金额' : '赎回金额';
                    setAmountText(text);
                    setPieType(val.target.value);
                  }}
                >
                  <Radio.Button value="purchaseAmtInfo">申购金额</Radio.Button>
                  <Radio.Button value="redeemAmtInfo">赎回金额</Radio.Button>
                </Radio.Group>
                <PickerComponent
                  onChange={(val: any) => seyCategoryParams(val)}
                  initialDate={dateInfo.dLastT1Day}
                />
              </div>
              <Radio.Group
                defaultValue=""
                buttonStyle="solid"
                style={{ marginTop: '10px' }}
                onChange={(val: any) => setChannelType(val.target.value)}
              >
                <Radio.Button value="">全部渠道</Radio.Button>
                <Radio.Button value="0">银行</Radio.Button>
                <Radio.Button value="1">券商</Radio.Button>
                <Radio.Button value="3">直销</Radio.Button>
                <Radio.Button value="4">三方</Radio.Button>
                <Radio.Button value="5">期货</Radio.Button>
                <Radio.Button value="9">其他</Radio.Button>
              </Radio.Group>
            </div>
            <ProCardPlus ghost>
              {!pieList[pieType] || pieList[pieType].length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <MyPieChart {...pieConfig} data={handleData(pieList[pieType] || [])} />
              )}
            </ProCardPlus>
          </ProCardPlus>
          <ProTable
            className={styles['card-table-style']}
            search={false}
            options={false}
            pagination={false}
            dataSource={handleData(pieList[pieType] || [])}
            columns={categoryColumns}
            rowKey="fundType"
            scroll={{ y: 300 }}
          />
        </ProCardPlus>
      </ProCardPlus>
      <ProCardPlus
        title="非货公募热门产品"
        direction="column"
        ghost
        style={{ backgroundColor: '#fff' }}
        extra={
          <Tooltip placement="left" title="按照非货公募产品维度，统计非货公募基金的累计申赎信息">
            <InfoCircleOutlined />
          </Tooltip>
        }
      >
        <div className={styles['sales-channel-conditions']}>
          <Radio.Group buttonStyle="solid" defaultValue="purchaseCumCnt" onChange={changeHotCharts}>
            <Radio.Button value="purchaseCumCnt">申购用户数</Radio.Button>
            <Radio.Button value="purchaseCnt">申购笔数</Radio.Button>
            <Radio.Button value="avgPurchaseAmt">人均申购金额</Radio.Button>
          </Radio.Group>
          <PickerComponent
            onChange={(val: any) => setHotParams(val)}
            initialType="3"
            initialDate={moment().format('YYYY-MM')}
          />
        </div>
        <Space style={{ fontSize: '16px', margin: '0 12px 12px' }}>
          <label>{labelText(chartType.hotFundType)}</label>
          <span>{hotFundInfo[chartType.hotFundType].total}万&nbsp;&nbsp;</span>
          <label>环比数：</label>
          <span
            style={{
              color: hotFundInfo[chartType.hotFundType].ratio?.startsWith('-')
                ? negativeColor
                : positiveColor,
            }}
          >
            {hotFundInfo[chartType.hotFundType].ratio}%
          </span>
        </Space>
        <ProCardPlus ghost>
          {!hotFundInfo.chartsList || hotFundInfo.chartsList.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Area {...hotFundConfig} />
          )}
        </ProCardPlus>
        <ProTable<HotFundListIndex>
          className={styles['card-table-style']}
          search={false}
          options={false}
          rowKey="agencyCode"
          style={{ marginTop: '20px' }}
          columns={hotFundColumns}
          params={{ ...hotParams, fundType }}
          pagination={{ ...hotPagination, showSizeChanger: false }}
          request={queryHotFundTableList}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </ProCardPlus>
    </ProCardPlus>
  );
};

export default NonMonetary;
