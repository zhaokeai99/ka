import Compare from '@/components/Compare';
import ProCardPlus from '@/components/ProCardPlus';
import { ThColumn } from '@/components/ThCharts/';
import DetailModal from '@/components/DetailModal';
import { COLORS, numberToT } from '@/utils/utils';
import { G2, Line } from '@ant-design/charts';
import { ExportOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { TabLayoutContext, useProState } from '@/components/thfund-front-component/src';
import { DatePicker, Select, Tag, Button } from 'antd';
import { flatMap as _flatMap, map as _map } from 'lodash';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import {
  queryIndexInfo,
  queryIndexLineChart,
  queryIndexLinePKChart,
  queryIndexValuation,
  queryIndustryDistribute,
  querySearchIndexInfo,
  queryStockConcentration,
  queryStockTop,
} from '../service';

const { RangePicker } = DatePicker;
const { Option } = Select;
const IndustryTypeEnum = {
  ZX1: 'zx_1',
  ZX2: 'zx_2',
  ZX3: 'zx_3',
  ZX4: 'zx_4',
  SW1: 'sw_1',
  SW2: 'sw_2',
  SW3: 'sw_3',
  SW4: 'sw_4',
};

G2.registerInteraction('element-link', {
  start: [{ trigger: 'interval:mouseenter', action: 'element-link-by-color:link' }],
  end: [{ trigger: 'interval:mouseleave', action: 'element-link-by-color:unlink' }],
});

const IndexCompare: React.FC<{ match: any }> = () => {
  const pathname = history.location.pathname;
  const paths = pathname.split('/_single_/');
  const indexCodes = paths[1] || '';
  const { key: tabKey, setTabTitle } = useContext(TabLayoutContext);
  const [indexTrendData, setIndexTrendData] = useProState({
    startDate: moment().subtract(3, 'year'),
    endDate: moment(),
    pointTrendData: { list: [] },
    flowTrendData: { list: [] },
    peTrendData: { list: [] },
    pbTrendData: { list: [] },
  });
  const [sampleStockData, setSampleStockData] = useState<{ topData: any[]; weightData: any[] }>({
    topData: [],
    weightData: [],
  });
  const [industryData, setIndustryData] = useState<any>({
    numData: [],
    weightsData: [],
  });
  const [stockTopData, setStockTopData] = useState<any[]>([]);
  const [diffTop10Key, setDiffTop10Key] = useState('stockWeights');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalSomething, SetModalSomething] = useState<{
    modalConfig: any;
    modalData: any[];
    modalType: string;
  }>({
    modalConfig: {},
    modalData: [],
    modalType: 'line',
  });

  // 基本信息表格配置
  const basicColumns: ProColumns<any>[] = [
    {
      title: '指数代码',
      dataIndex: 'indexCode',
      key: 'indexCode',
      render: (_, item) => (
        <a target="_blank" href={item.indexWebsite} rel="noopener noreferrer">
          {_}
          <ExportOutlined style={{ marginLeft: '5px' }} />
        </a>
      ),
    },
    {
      title: '指数简称',
      dataIndex: 'indexShortName',
      key: 'indexShortName',
    },
    {
      title: '指数全称',
      dataIndex: 'indexName',
      key: 'indexName',
    },
    {
      title: '发布方',
      dataIndex: 'publisher',
      key: 'publisher',
    },
    {
      title: '指数类型',
      dataIndex: 'indexType',
      key: 'indexType',
    },
    {
      title: '样本数量',
      dataIndex: 'sampleNum',
      key: 'sampleNum',
    },
    {
      title: '发布时间',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
    },
    {
      title: '基准日',
      dataIndex: 'basePeriod',
      key: 'basePeriod',
    },
  ];

  // 估值数据表格配置
  const pdColumns: ProColumns<
    any,
    'FundPercent' | 'FundDigit' | 'FundDigit_2' | 'FundMoney_10' | 'FundMoney_4'
  >[] = [
    {
      title: '指数名称',
      dataIndex: 'indexName',
      key: 'indexName',
    },
    {
      title: '近一日',
      dataIndex: 'pctChangeOneDay',
      key: 'pctChangeOneDay',
      valueType: 'FundPercent',
    },
    {
      title: '近五日',
      dataIndex: 'pctChangeFiveDay',
      key: 'pctChangeFiveDay',
      valueType: 'FundPercent',
    },
    {
      title: '近二十日',
      dataIndex: 'pctChangeTwentyDay',
      key: 'pctChangeTwentyDay',
      valueType: 'FundPercent',
    },
    {
      title: '近一年',
      dataIndex: 'pctChangeOneYear',
      key: 'pctChangeOneYear',
      valueType: 'FundPercent',
    },
    {
      title: '近三年',
      dataIndex: 'pctChangeThreeYear',
      key: 'pctChangeThreeYear',
      valueType: 'FundPercent',
    },
    {
      title: '近三年年化收益',
      dataIndex: 'yieldThreeYear',
      key: 'yieldThreeYear',
      valueType: 'FundPercent',
    },
    {
      title: '最新点位',
      dataIndex: 'preClose',
      key: 'preClose',
      valueType: 'FundDigit',
    },
    {
      title: '最新自由市场流通市值(单位：亿元)',
      dataIndex: 'floatMarketValue',
      key: 'floatMarketValue',
      render: (item: any) => {
        if (typeof item === 'number') {
          return item?.toFixed(4);
        }
        return item;
      },
    },
    {
      title: '最新pe',
      dataIndex: 'pe',
      key: 'pe',
      valueType: 'FundDigit',
    },
    {
      title: '最新pb',
      dataIndex: 'pb',
      key: 'pb',
      valueType: 'FundDigit',
    },
    {
      title: 'SH-最差流动性',
      dataIndex: 'worstLiquiditySh',
      key: 'worstLiquiditySh',
      valueType: 'FundDigit_2',
    },
    {
      title: 'SZ-最差流动性',
      dataIndex: 'worstLiquiditySz',
      key: 'worstLiquiditySz',
      valueType: 'FundDigit_2',
    },
    {
      title: 'HK-最差流动性',
      dataIndex: 'worstLiquidityHk',
      key: 'worstLiquidityHk',
      valueType: 'FundDigit_2',
    },
    {
      title: '近一年波动',
      dataIndex: 'volatilityOneYear',
      key: 'volatilityOneYear',
    },
    {
      title: '近三年波动',
      dataIndex: 'volatilityThreeYear',
      key: 'volatilityThreeYear',
    },
  ];

  // 指数走势收益率线图配置
  const linePKConfig: any = () => {
    return {
      style: { width: '100%', height: '250px' },
      xField: 'tradeDate',
      yField: 'percent',
      seriesField: 'indexName',
      appendPadding: 14,
      smooth: true,
      legend: {
        position: 'top',
        itemHeight: 15,
      },
      yAxis: {
        label: {
          formatter: (v: any) => {
            return v + '%';
          },
        },
      },
      xAxis: {
        label: {
          autoRotate: true,
          autoHide: true,
        },
      },
      tooltip: {
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
        showMarkers: false,
        customItems: (items) => {
          if (items) {
            items.forEach((element) => {
              if (element) {
                element.value = (element.data && element.data.realPercent + '%') || '--';
              }
            });
          }
          return items;
        },
      },
    };
  };

  // 指数走势线图配置
  const lineConfig: any = (tickCount) => {
    return {
      style: { width: '100%', height: '250px' },
      xField: 'name',
      yField: 'value',
      seriesField: 'indexName',
      appendPadding: 14,
      smooth: true,
      legend: { position: 'top', itemHeight: 15 },
      yAxis: {
        label: {
          formatter: (v: any) => {
            return numberToT(v);
          },
        },
      },
      xAxis: {
        label: {
          autoRotate: true,
          autoHide: true,
        },
        tickCount,
      },
    };
  };

  // 柱状占比配置
  const columnConfig: (params: { suffix: string; fixed: number }) => any = useCallback(
    ({ suffix, fixed }) => ({
      style: { width: '100%', height: '250px' },
      xField: 'indexName',
      yField: 'value',
      seriesField: 'name',
      isGroup: true,
      xAxis: {
        label: {
          autoRotate: true,
          autoHide: true,
        },
      },
      tooltip: {
        customContent: (title: string, items: any) => (
          <>
            <h5 style={{ marginTop: 16 }}>{title}</h5>
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item: any, index: number) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.year}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <span className="g2-tooltip-marker" style={{ backgroundColor: color }}></span>
                    <span
                      style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
                    >
                      <span style={{ marginRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">
                        {parseFloat(value).toFixed(fixed)}
                        {suffix}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        ),
      },
    }),
    [],
  );

  // 百分比柱状对比配置
  const diffIndustryConfig: any = {
    style: { width: '100%', height: '250px' },
    isPercent: true,
    isStack: true,
    xField: 'indexName',
    yField: 'value',
    seriesField: 'name',
    interactions: [{ type: 'element-highlight-by-color' }, { type: 'element-link' }],
    legend: {
      itemHeight: 15,
    },
    maxColumnWidth: 50,
  };

  // 柱状top10对比配置
  const diffColumnConfig: any = useMemo(
    () => ({
      style: { width: '100%', height: '400px' },
      isStack: true,
      maxColumnWidth: 120,
      xField: 'indexName',
      seriesField: 'stockName',
      label: {
        position: 'middle',
        content: (item: any) => {
          switch (diffTop10Key) {
            case 'stockWeights':
              return `${item.stockName}: ${parseFloat(item.stockWeights).toFixed(2)}%`;
            case 'stockPoint':
              return `${item.stockName}: ${item.stockPoint}`;
            case 'freeMarketValue':
              return `${item.stockName}: ${(item.freeMarketValue / 10000).toFixed(2)}亿`;
            case 'pe':
              return `${item.stockName}: ${parseFloat(item.pe).toFixed(2)}`;
            case 'pb':
              return `${item.stockName}: ${parseFloat(item.pb).toFixed(2)}`;
            case 'totalMarketCapitalization':
              return `${item.stockName}: ${(item.totalMarketCapitalization / 10000).toFixed(2)}亿`;
            default:
              return '';
          }
        },
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
      },
      tooltip: {
        shared: false,
        customContent: (title: string, items: any) => {
          if (items.length !== 1) return null;
          const { data } = items[0];
          const {
            stockCode,
            stockName,
            stockPoint,
            stockWeights,
            freeMarketValue,
            pe,
            pb,
            pctChangeOneDay,
            pctChangeFiveDay,
            pctChangeTwentyDay,
            totalMarketCapitalization,
            zxLevel1Name,
            zxLevel2Name,
            zxLevel3Name,
            swLevel1Name,
            swLevel2Name,
            swLevel3Name,
          } = data || {};

          return (
            <>
              <h5 style={{ marginTop: 16 }}>{title}</h5>
              <ul style={{ paddingLeft: 0 }}>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>证券编号:</span>
                    <span>{stockCode}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>证券名称:</span>
                    <span>{stockName}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>权重:</span>
                    <span>
                      {stockWeights === null ? '-' : parseFloat(stockWeights).toFixed(2)}%
                    </span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>点位:</span>
                    <span>
                      {stockPoint === null ? '-' : parseFloat(stockPoint || 0).toFixed(2)}
                    </span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>自由流通市值:</span>
                    <span>
                      {freeMarketValue === null
                        ? '-'
                        : parseFloat((freeMarketValue / 10000).toFixed(2))}
                      亿
                    </span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>市盈率:</span>
                    <span>{pe === null ? '-' : parseFloat(pe).toFixed(2)}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>市净率:</span>
                    <span>{pb === null ? '-' : parseFloat(pb).toFixed(2)}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>总市值:</span>
                    <span>
                      {totalMarketCapitalization === null
                        ? '-'
                        : parseFloat(totalMarketCapitalization / 10000).toFixed(2)}
                      亿
                    </span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>近一日跌涨幅:</span>
                    <span style={{ color: pctChangeOneDay < 0 ? 'green' : 'red' }}>
                      {pctChangeOneDay === null ? '-' : (pctChangeOneDay * 100).toFixed(2)}%
                    </span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>近五日跌涨幅:</span>
                    <span style={{ color: pctChangeFiveDay < 0 ? 'green' : 'red' }}>
                      {pctChangeFiveDay === null ? '-' : (pctChangeFiveDay * 100).toFixed(2)}%
                    </span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>近十二日跌涨幅:</span>
                    <span style={{ color: pctChangeTwentyDay < 0 ? 'green' : 'red' }}>
                      {pctChangeTwentyDay === null ? '-' : (pctChangeTwentyDay * 100).toFixed(2)}%
                    </span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>中信1:</span>
                    <span>{zxLevel1Name}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>中信2:</span>
                    <span>{zxLevel2Name}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>中信3:</span>
                    <span>{zxLevel3Name}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>申万1:</span>
                    <span>{swLevel1Name}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>申万2:</span>
                    <span>{swLevel2Name}</span>
                  </span>
                </li>
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ marginRight: 16 }}>申万3:</span>
                    <span>{swLevel3Name}</span>
                  </span>
                </li>
              </ul>
            </>
          );
        },
      },
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      interactions: [{ type: 'element-highlight-by-color' }, { type: 'element-link' }],
      legend: {
        itemHeight: 15,
        flipPage: false,
      },
    }),
    [diffTop10Key],
  );

  // 获取线图
  const fetchIndexLineData = useCallback(
    async (date?: any) => {
      const [pointTrendData, flowTrendData, peTrendData, pbTrendData] = await Promise.all(
        [
          queryIndexLinePKChart({
            indexCode: indexCodes,
            bizType: 'PRE_CLOSE',
            startDate: date && date[0].format('YYYYMMDD'),
            endDate: date && date[1].format('YYYYMMDD'),
          }),
        ].concat(
          ['FLOAT_MARKET_VALUE', 'PE', 'PB'].map((bizType) =>
            queryIndexLineChart({
              indexCode: indexCodes,
              bizType,
              startDate: date && date[0].format('YYYY-MM-DD'),
              endDate: date && date[1].format('YYYY-MM-DD'),
            }),
          ),
        ),
      );

      setIndexTrendData({
        pointTrendData,
        flowTrendData,
        peTrendData,
        pbTrendData,
      });
    },
    [indexCodes, setIndexTrendData],
  );

  // 获取柱状对比图
  const fetchSamplePieData = useCallback(async () => {
    const result = await queryStockConcentration({ indexCode: indexCodes });
    setSampleStockData({
      topData:
        result?.topData?.map((d: { value: string }) => ({
          ...d,
          value: parseFloat(d.value),
        })) || [],
      weightData:
        result?.weightsData?.map((d: { value: string }) => ({
          ...d,
          value: parseFloat(d.value),
        })) || [],
    });
  }, [indexCodes]);

  // 获取行业分布对比
  const fetchIndustryData = useCallback(
    async (industryType = IndustryTypeEnum.SW1) => {
      const result = await queryIndustryDistribute({ indexCode: indexCodes, industryType });
      setIndustryData({
        numData: _flatMap(result, ({ numData = [], indexCode = '', indexName = '' }) => {
          if (numData === null) return [{ indexCode, indexName }];
          return _map(numData, (item: any) => ({
            ...item,
            value: item.value / 1,
            indexCode,
            indexName,
          }));
        }),
        weightsData: _flatMap(result, ({ weightsData = [], indexCode = '', indexName = '' }) => {
          if (weightsData === null) return [{ indexCode, indexName }];
          return _map(weightsData, (item: any) => ({
            ...item,
            value: item.value / 100,
            indexCode,
            indexName,
          }));
        }),
      });
    },
    [indexCodes],
  );

  // 获取top10对比
  const fetchStockTopData = useCallback(async () => {
    const result = await queryStockTop({ indexCode: indexCodes, topNum: 10 });
    setStockTopData(
      _flatMap(result, ({ data = [], indexCode = '', indexName = '' }) => {
        if (data === null) return [{ indexCode, indexName }];
        return _map(data, (stock: any) => ({ ...stock, indexCode, indexName }));
      }),
    );
  }, [indexCodes]);

  useEffect(() => {
    (async () => {
      const { data } = await queryIndexInfo(indexCodes);
      if (Array.isArray(data) && data.length > 0) {
        setTabTitle(tabKey, _map(data, 'indexName').join(' vs '));
      }
    })();

    fetchSamplePieData();
    fetchIndexLineData([indexTrendData.startDate, indexTrendData.endDate]);
    fetchIndustryData();
    fetchStockTopData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTop10Item = useCallback((item) => {
    setDiffTop10Key(item);
  }, []);

  const onChangeIndustry = useCallback(
    (value) => {
      fetchIndustryData(value);
    },
    [fetchIndustryData],
  );

  const onCompare = useCallback(async () => {
    const { data } = await queryIndexInfo(indexCodes);
    return data;
  }, [indexCodes]);

  return (
    <ProCard
      ghost
      gutter={[0, 8]}
      style={{ padding: '0 12px' }}
      direction="column"
      size="small"
      title={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {`指数对比`}
          <span style={{ margin: 'auto 10px' }}>-</span>
          {indexCodes?.split(',').map((indexCode: string, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <Tag
              key={index}
              color={COLORS[index]}
              closable={indexCodes?.split(',').length > 2}
              onClose={() => {
                const newIndexCodes =
                  indexCodes?.split(',')?.filter((code) => code !== indexCode) || [];

                history.push(`/production/indexStock/compare/_single_/${newIndexCodes.join(',')}`);
              }}
            >
              {indexCode}
            </Tag>
          ))}
        </span>
      }
      extra={
        <Compare
          request={onCompare}
          searchInfo={querySearchIndexInfo}
          openUrl="/production/indexStock/compare/_single_/"
          labelName="indexName"
          keyName="indexCode"
        />
      }
    >
      <ProCardPlus title="基本信息" isTable={true}>
        <ProTable
          columns={basicColumns}
          request={() => queryIndexInfo(indexCodes)}
          search={false}
          options={false}
          pagination={false}
          rowKey="indexCode"
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </ProCardPlus>
      <ProCardPlus title="估值数据" isTable={true}>
        <ProTable
          columns={pdColumns}
          search={false}
          size="small"
          rowKey="indexCode"
          options={false}
          pagination={false}
          request={() => queryIndexValuation(indexCodes)}
          scroll={{ x: 'max-content' }}
        />
      </ProCardPlus>
      <ProCardPlus
        title="指数走势"
        direction="column"
        extra={
          <RangePicker
            defaultValue={[indexTrendData.startDate, indexTrendData.endDate]}
            onChange={fetchIndexLineData}
          />
        }
        layout="center"
      >
        <div style={{ width: '100%', display: 'flex', padding: '0 2px' }}>
          <ProCard
            layout="center"
            title={<span style={{ fontSize: '14px' }}>点位涨跌幅走势</span>}
            bordered
            style={{ width: '25%' }}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                  SetModalSomething({
                    modalConfig: { ...linePKConfig() },
                    modalData: indexTrendData.pointTrendData.list,
                    modalType: 'line',
                  });
                }}
              >
                详情
              </Button>
            }
          >
            <Line {...linePKConfig()} data={indexTrendData.pointTrendData.list} />
          </ProCard>
          <ProCard
            layout="center"
            title={<span style={{ fontSize: '14px' }}>流通市值走势</span>}
            bordered
            style={{ width: '25%', marginLeft: 8 }}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                  SetModalSomething({
                    modalConfig: { ...lineConfig(20) },
                    modalData: indexTrendData.flowTrendData.list,
                    modalType: 'line',
                  });
                }}
              >
                详情
              </Button>
            }
          >
            <Line {...useMemo(() => lineConfig(10), [])} data={indexTrendData.flowTrendData.list} />
          </ProCard>
          <ProCard
            layout="center"
            title={<span style={{ fontSize: '14px' }}>PE走势</span>}
            bordered
            style={{ width: '25%', marginLeft: 8 }}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                  SetModalSomething({
                    modalConfig: { ...lineConfig(20) },
                    modalData: indexTrendData.flowTrendData.list,
                    modalType: 'line',
                  });
                }}
              >
                详情
              </Button>
            }
          >
            <Line {...useMemo(() => lineConfig(10), [])} data={indexTrendData.peTrendData.list} />
          </ProCard>
          <ProCard
            layout="center"
            title={<span style={{ fontSize: '14px' }}>PB走势</span>}
            bordered
            style={{ width: '25%', marginLeft: 8 }}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                  SetModalSomething({
                    modalConfig: { ...lineConfig(20) },
                    modalData: indexTrendData.pbTrendData.list,
                    modalType: 'line',
                  });
                }}
              >
                详情
              </Button>
            }
          >
            <Line {...useMemo(() => lineConfig(10), [])} data={indexTrendData.pbTrendData.list} />
          </ProCard>
        </div>
      </ProCardPlus>
      <ProCardPlus title="样本股图" gutter={8} layout="center">
        <div style={{ width: '100%', display: 'flex', padding: '0 6px' }}>
          <ProCard layout="center" title="TOP占比" bordered style={{ width: '50%' }}>
            <ThColumn
              {...useMemo(() => columnConfig({ suffix: '%', fixed: 2 }), [columnConfig])}
              data={sampleStockData.topData}
            />
          </ProCard>
          <ProCard
            layout="center"
            title="权重占比"
            bordered
            style={{ width: '50%', marginLeft: 8 }}
          >
            <ThColumn
              {...useMemo(() => columnConfig({ suffix: '只', fixed: 0 }), [columnConfig])}
              data={sampleStockData.weightData}
            />
          </ProCard>
        </div>
      </ProCardPlus>
      <ProCardPlus
        title="行业分布对比"
        extra={
          <Select
            defaultValue={IndustryTypeEnum.SW1}
            onChange={onChangeIndustry}
            style={{ width: '150px' }}
          >
            <Option value={IndustryTypeEnum.SW1}>申万一级</Option>
            <Option value={IndustryTypeEnum.SW2}>申万二级</Option>
            <Option value={IndustryTypeEnum.SW3}>申万三级</Option>
            <Option value={IndustryTypeEnum.ZX1}>中信一级</Option>
            <Option value={IndustryTypeEnum.ZX2}>中信二级</Option>
            <Option value={IndustryTypeEnum.ZX3}>中信三级</Option>
          </Select>
        }
        gutter={[8, 0]}
      >
        <div style={{ width: '100%', display: 'flex', padding: '0 6px' }}>
          <ProCard
            layout="center"
            bordered
            title="权重"
            style={{ width: '50%' }}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                  SetModalSomething({
                    modalConfig: { ...diffIndustryConfig },
                    modalData: industryData.weightsData,
                    modalType: 'column',
                  });
                }}
              >
                详情
              </Button>
            }
          >
            <ThColumn {...diffIndustryConfig} data={industryData.weightsData} />
          </ProCard>
          <ProCard
            layout="center"
            bordered
            title="数量"
            style={{ width: '50%', marginLeft: 8 }}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                  SetModalSomething({
                    modalConfig: { ...diffIndustryConfig, isPercent: false },
                    modalData: industryData.numData,
                    modalType: 'column',
                  });
                }}
              >
                详情
              </Button>
            }
          >
            <ThColumn {...diffIndustryConfig} isPercent={false} data={industryData.numData} />
          </ProCard>
        </div>
      </ProCardPlus>
      <ProCardPlus
        title="TOP10对比"
        extra={
          <Select
            defaultValue="stockWeights"
            onChange={onChangeTop10Item}
            style={{ width: '150px' }}
          >
            <Option value="stockWeights">权重</Option>
            <Option value="stockPoint">点位</Option>
            <Option value="freeMarketValue">自由流通市值</Option>
            <Option value="pe">市盈率</Option>
            <Option value="pb">市净率</Option>
            <Option value="totalMarketCapitalization">总市值</Option>
          </Select>
        }
      >
        <ProCard layout="center">
          <ThColumn {...diffColumnConfig} yField={diffTop10Key} data={stockTopData} />
        </ProCard>
      </ProCardPlus>
      <DetailModal
        modalSomething={modalSomething}
        isModalVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
    </ProCard>
  );
};
export default IndexCompare;
