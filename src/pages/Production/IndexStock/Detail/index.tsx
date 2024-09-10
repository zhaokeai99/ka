import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { DatePicker, Select, Empty, Tag, List, Spin, Button, message } from 'antd';
import { history } from 'umi';
import { ExportOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Line, Column, Pie } from '@ant-design/charts';
import moment from 'moment';
import { get as _get, map as _map } from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useProState, TabLayoutContext } from '@/components/thfund-front-component/src';
import ProCardPlus from '@/components/ProCardPlus';
import Search from '@/components/Search';
import Compare from '@/components/Compare';
import { numberToT } from '@/utils/utils';
import {
  queryIndexInfo,
  queryIndexValuation,
  queryStockInfoPageList,
  queryStockConcentration,
  queryIndexLineChart,
  queryIndustryDistribute,
  queryIndexCoreConfigDetail,
  queryStockInfoExport,
  querySearchIndexInfo,
  queryTrackIndexProductList,
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

const IndexDetail: React.FC<{ match: any }> = (props) => {
  const { indexCode } = props.match.params;
  const { key: tabKey, setTabTitle } = useContext(TabLayoutContext);
  const [indexTrendData, setIndexTrendData] = useProState({
    startDate: moment().subtract(3, 'year'),
    endDate: moment(),
    pointTrendData: [],
    flowTrendData: [],
    peTrendData: [],
    pbTrendData: [],
    pointTrendLatestQuantile: '-',
    pointTrendLatestValue: '-',
    flowTrendLatestQuantile: '-',
    flowTrendLatestValue: '-',
    peTrendLatestQuantile: '-',
    peTrendLatestValue: '-',
    pbTrendLatestQuantile: '-',
    pbTrendLatestValue: '-',
  });
  const [sampleStockData, setSampleStockData] = useState<{ topData: any[]; weightData: any[] }>({
    topData: [],
    weightData: [],
  });
  const [zxIndustryData, setZxIndustryData] = useState<any>({
    numData: [],
    weightsData: [],
  });
  const [swIndustryData, setSwIndustryData] = useState<any>({
    numData: [],
    weightsData: [],
  });
  const [coreFit, setCoreFit] = useState();
  const [coreList, setCoreList] = useState([]);
  const [coreLoading, setCoreLoading] = useState(false);
  const [stockDate, setStockDate] = useState('');
  const [searchStockCode, setSearchStockCode] = useState('');
  const [searchStockName, setSearchStockName] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackList, setTrackList] = useState([]);

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

  const bondColumns: ProColumns<
    any,
    'FundPercent' | 'FundDigit' | 'FundDigit_2' | 'FundMoney_10' | 'FundMoney_4'
  >[] = [
    {
      title: '证券编号',
      dataIndex: 'stockCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: '证券名称',
      dataIndex: 'stockName',
      width: 150,
      fixed: 'left',
    },
    {
      title: '权重',
      dataIndex: 'stockWeights',
      width: 100,
      fixed: 'left',
      // valueType: 'FundDigit',
      search: false,
    },
    {
      title: '点位',
      dataIndex: 'stockPoint',
      width: 100,
      fixed: 'left',
      search: false,
    },
    {
      title: '自由流通市值(单位：亿元)',
      dataIndex: 'freeMarketValue',
      search: false,
      render: (item: any) => {
        if (typeof item === 'number') {
          return item?.toFixed(4);
        }
        return item;
      },
    },
    {
      title: '市盈率',
      dataIndex: 'pe',
      search: false,
      valueType: 'FundDigit',
    },
    {
      title: '市净率',
      dataIndex: 'pb',
      search: false,
      valueType: 'FundDigit',
    },
    {
      title: '总市值(单位：亿元)',
      dataIndex: 'totalMarketCapitalization',
      search: false,
      render: (item: any) => {
        if (typeof item === 'number') {
          return item?.toFixed(4);
        }
        return item;
      },
    },
    {
      title: '近一日跌涨幅',
      dataIndex: 'pctChangeOneDay',
      search: false,
      valueType: 'FundPercent',
    },
    {
      title: '近五日跌涨幅',
      dataIndex: 'pctChangeFiveDay',
      search: false,
      // sorter: true,
      valueType: 'FundPercent',
    },
    {
      title: '近二十日跌涨幅',
      dataIndex: 'pctChangeTwentyDay',
      search: false,
      // sorter: true,
      valueType: 'FundPercent',
    },
    {
      title: '中信1',
      dataIndex: 'zxLevel1Name',
      search: false,
      // sorter: true,
    },
    {
      title: '中信2',
      dataIndex: 'zxLevel2Name',
      search: false,
      // sorter: true,
    },
    {
      title: '中信3',
      dataIndex: 'zxLevel3Name',
      search: false,
      // sorter: true,
    },
    {
      title: '申万1',
      dataIndex: 'swLevel1Name',
      search: false,
      // sorter: true,
    },
    {
      title: '申万2',
      dataIndex: 'swLevel2Name',
      search: false,
      // sorter: true,
    },
    {
      title: '申万3',
      dataIndex: 'swLevel3Name',
      search: false,
      // sorter: true,
    },
  ];

  const lineConfig: any = () => {
    return {
      style: { width: '100%', height: '250px' },
      xField: 'name',
      yField: 'value',
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
      },
      appendPadding: 14,
      tooltip: {
        fields: ['value', 'quantile'],
        formatter: ({ value, quantile }: any) => {
          return { name: 'value', value: `${value} (${quantile} 分位)` };
        },
      },
    };
  };

  const columnConfig = {
    style: { width: '100%', height: '250px' },
    xField: 'name',
    yField: 'value',
    meta: {
      value: { alias: '占比' },
    },
  };

  const pieConfig: any = useMemo(
    () => ({
      appendPadding: 10,
      style: { width: '100%', height: '250px' },
      angleField: 'value',
      colorField: 'name',
      radius: 0.7,
      legend: false,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
    }),
    [],
  );

  // 获取柱状图
  const fetchSampleColumnData = useCallback(async () => {
    const result = await queryStockConcentration({ indexCode });
    setSampleStockData({
      topData:
        result?.topData?.map((data: { name: any; value: string }) => ({
          name: data.name,
          value: parseFloat(data.value),
        })) || [],
      weightData:
        result?.weightsData?.map((data: { name: any; value: string }) => ({
          name: data.name,
          value: parseFloat(data.value),
        })) || [],
    });
  }, [indexCode]);

  // 获取线图
  const fetchIndexLineData = useCallback(
    async (date?: any) => {
      const [
        {
          list: pointTrendData,
          latestQuantile: pointTrendLatestQuantile,
          latestValue: pointTrendLatestValue,
        },
        {
          list: flowTrendData,
          latestQuantile: flowTrendLatestQuantile,
          latestValue: flowTrendLatestValue,
        },
        {
          list: peTrendData,
          latestQuantile: peTrendLatestQuantile,
          latestValue: peTrendLatestValue,
        },
        {
          list: pbTrendData,
          latestQuantile: pbTrendLatestQuantile,
          latestValue: pbTrendLatestValue,
        },
      ] = await Promise.all(
        ['PRE_CLOSE', 'FLOAT_MARKET_VALUE', 'PE', 'PB'].map((bizType) =>
          queryIndexLineChart({
            indexCode,
            bizType,
            startDate: date && date[0].format('YYYY-MM-DD'),
            endDate: date && date[1].format('YYYY-MM-DD'),
          }),
        ),
      );

      setIndexTrendData({
        pointTrendData,
        flowTrendData,
        peTrendData,
        pbTrendData,
        pointTrendLatestQuantile: pointTrendLatestQuantile || '-',
        pointTrendLatestValue: pointTrendLatestValue || '-',
        flowTrendLatestQuantile: flowTrendLatestQuantile || '-',
        flowTrendLatestValue: flowTrendLatestValue || '-',
        peTrendLatestQuantile: peTrendLatestQuantile || '-',
        peTrendLatestValue: peTrendLatestValue || '-',
        pbTrendLatestQuantile: pbTrendLatestQuantile || '-',
        pbTrendLatestValue: pbTrendLatestValue || '-',
      });
    },
    [indexCode, setIndexTrendData],
  );

  // 获取饼状图 - sw类型
  const fetchSwIndustryData = useCallback(
    async (industryType = IndustryTypeEnum.SW1) => {
      const result = await queryIndustryDistribute({ indexCode, industryType });
      setSwIndustryData({
        numData: _map(_get(result, '[0].numData', []), (data) => ({
          ...data,
          value: parseFloat(data.value),
        })),
        weightsData: _map(_get(result, '[0].weightsData', []), (data) => ({
          ...data,
          value: parseFloat(data.value),
        })),
      });
    },
    [indexCode],
  );
  // 获取饼状图 - zx类型
  const fetchZxIndustryData = useCallback(
    async (industryType = IndustryTypeEnum.ZX1) => {
      const result = await queryIndustryDistribute({ indexCode, industryType });
      setZxIndustryData({
        numData: _map(_get(result, '[0].numData', []), (data) => ({
          ...data,
          value: parseFloat(data.value),
        })),
        weightsData: _map(_get(result, '[0].weightsData', []), (data) => ({
          ...data,
          value: parseFloat(data.value),
        })),
      });
    },
    [indexCode],
  );
  // 获取算法描述
  const fetchIndexCoreConfigDetail = useCallback(async () => {
    setCoreLoading(true);
    const { isFit, listStr } = (await queryIndexCoreConfigDetail({ indexCode })) || {};
    setCoreFit(isFit);
    setCoreList(listStr || []);
    setCoreLoading(false);
  }, [indexCode]);

  // 获取跟标指数
  const fetchTrackIndexProductList = useCallback(async () => {
    setTrackLoading(true);
    const result = (await queryTrackIndexProductList({ indexCode })) || [];
    setTrackList(result);
    setTrackLoading(false);
  }, [indexCode]);

  useEffect(() => {
    (async () => {
      const { data } = await queryIndexInfo(indexCode);
      if (Array.isArray(data) && data.length === 1) {
        setTabTitle(tabKey, data[0].indexName);
      }
    })();

    fetchSampleColumnData();
    fetchIndexLineData([indexTrendData.startDate, indexTrendData.endDate]);
    fetchSwIndustryData();
    fetchZxIndustryData();
    fetchIndexCoreConfigDetail();
    fetchTrackIndexProductList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeZxIndustry = (value) => {
    fetchZxIndustryData(value);
  };

  const onChangeSwIndustry = (value) => {
    fetchSwIndustryData(value);
  };

  const onCopy = () => {
    message.info('复制成功');
  };

  const onDownload = async () => {
    const downloadUrl = await queryStockInfoExport({
      indexCode,
      stockCode: searchStockCode,
      stockName: searchStockName,
    });

    if (!downloadUrl) {
      return;
    }

    window.open(downloadUrl);
  };

  const onCompare = useCallback(() => querySearchIndexInfo({ keyword: indexCode }), [indexCode]);

  return (
    <ProCard
      ghost
      gutter={[0, 8]}
      style={{ padding: '0 12px' }}
      title={
        <div>
          <span style={{ marginRight: '10px' }}>{`指数详情 - ${indexCode}`}</span>
          <Search
            searchInfo={querySearchIndexInfo}
            openUrl="/production/indexStock/detail/"
            labelName="indexName"
            keyName="indexCode"
          />
        </div>
      }
      direction="column"
      size="small"
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
          request={() => queryIndexInfo(indexCode)}
          search={false}
          options={false}
          pagination={false}
          rowKey="indexCode"
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </ProCardPlus>
      <ProCardPlus title="估值数据" isTable={true}>
        <ProTable
          columns={pdColumns}
          search={false}
          rowKey="indexCode"
          options={false}
          pagination={false}
          size="small"
          request={() => queryIndexValuation(indexCode)}
          scroll={{ x: 'max-content' }}
        />
      </ProCardPlus>
      <ProCardPlus
        title="指数走势"
        direction="column"
        gutter={[0, 8]}
        extra={
          <RangePicker
            defaultValue={[indexTrendData.startDate, indexTrendData.endDate]}
            onChange={fetchIndexLineData}
          />
        }
        layout="center"
      >
        <ProCard gutter={[8, 0]} layout="center">
          <ProCard
            layout="center"
            bordered
            title={<span style={{ fontSize: '14px' }}>点位</span>}
            extra={
              <span>{`最新: ${indexTrendData.pointTrendLatestValue} 分位: ${
                indexTrendData.pointTrendLatestQuantile || ''
              }`}</span>
            }
          >
            {Array.isArray(indexTrendData.pointTrendData) &&
            indexTrendData.pointTrendData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Line {...lineConfig()} data={indexTrendData.pointTrendData} />
            )}
          </ProCard>
          <ProCard
            layout="center"
            bordered
            title={<span style={{ fontSize: '14px' }}>流通市值</span>}
            extra={
              <span>{`最新: ${indexTrendData.flowTrendLatestValue} 分位: ${indexTrendData.flowTrendLatestQuantile}`}</span>
            }
          >
            {Array.isArray(indexTrendData.flowTrendData) &&
            indexTrendData.flowTrendData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Line {...lineConfig()} data={indexTrendData.flowTrendData} />
            )}
          </ProCard>
          <ProCard
            layout="center"
            bordered
            title={<span style={{ fontSize: '14px' }}>PE</span>}
            extra={
              <span>{`最新: ${indexTrendData.peTrendLatestValue} 分位: ${indexTrendData.peTrendLatestQuantile}`}</span>
            }
          >
            {Array.isArray(indexTrendData.peTrendData) &&
            indexTrendData.peTrendData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Line {...lineConfig()} data={indexTrendData.peTrendData} />
            )}
          </ProCard>
          <ProCard
            layout="center"
            bordered
            title={<span style={{ fontSize: '14px' }}>PB</span>}
            extra={
              <span>{`最新: ${indexTrendData.pbTrendLatestValue} 分位: ${indexTrendData.pbTrendLatestQuantile}`}</span>
            }
          >
            {Array.isArray(indexTrendData.pbTrendData) &&
            indexTrendData.pbTrendData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Line {...lineConfig()} data={indexTrendData.pbTrendData} />
            )}
          </ProCard>
        </ProCard>
      </ProCardPlus>
      <ProCardPlus title="行业分布" gutter={[0, 8]} layout="center" direction="row">
        <ProCard
          layout="center"
          gutter={[8, 0]}
          title="申万"
          extra={
            <Select
              defaultValue={IndustryTypeEnum.SW1}
              onChange={onChangeSwIndustry}
              style={{ width: '150px' }}
            >
              <Option value={IndustryTypeEnum.SW1}>申万一级</Option>
              <Option value={IndustryTypeEnum.SW2}>申万二级</Option>
              <Option value={IndustryTypeEnum.SW3}>申万三级</Option>
            </Select>
          }
        >
          <ProCard layout="center" title="权重" bordered>
            <Pie {...pieConfig} data={swIndustryData.weightsData} />
          </ProCard>
          <ProCard layout="center" title="数量" bordered>
            <Pie {...pieConfig} data={swIndustryData.numData} />
          </ProCard>
        </ProCard>
        <ProCard
          layout="center"
          gutter={[8, 0]}
          title="中信"
          extra={
            <Select
              defaultValue={IndustryTypeEnum.ZX1}
              style={{ width: '150px' }}
              onChange={onChangeZxIndustry}
            >
              <Option value={IndustryTypeEnum.ZX1}>中信一级</Option>
              <Option value={IndustryTypeEnum.ZX2}>中信二级</Option>
              <Option value={IndustryTypeEnum.ZX3}>中信三级</Option>
            </Select>
          }
        >
          <ProCard layout="center" title="权重" bordered>
            <Pie {...pieConfig} data={zxIndustryData.weightsData} />
          </ProCard>
          <ProCard layout="center" title="数量" bordered>
            <Pie {...pieConfig} data={zxIndustryData.numData} />
          </ProCard>
        </ProCard>
      </ProCardPlus>
      <ProCardPlus ghost gutter={[8, 0]}>
        <ProCardPlus title="样本股图" gutter={[8, 0]} layout="center" colSpan={16}>
          <ProCard layout="center" title="TOP占比" bordered>
            <Column data={sampleStockData.topData} {...columnConfig} />
          </ProCard>
          <ProCard layout="center" title="权重占比" bordered>
            <Column data={sampleStockData.weightData} {...columnConfig} />
          </ProCard>
        </ProCardPlus>
        <ProCardPlus title="跟踪标的产品" gutter={[8, 0]} layout="center" colSpan={8}>
          <List
            header={false}
            footer={false}
            style={{ height: '315px', overflowY: 'auto' }}
            // bordered={false}
            loading={trackLoading}
            dataSource={trackList}
            renderItem={(item: any, index) => (
              <List.Item>
                {item.fundId ? (
                  <a
                    onClick={() => {
                      if (item.fundId) {
                        history.push(`/production/index/detail/${item.fundId}`);
                      }
                    }}
                  >
                    {index + 1}.{item.text}
                  </a>
                ) : (
                  `${index + 1}.${item.text}`
                )}
              </List.Item>
            )}
          />
        </ProCardPlus>
      </ProCardPlus>
      <ProCardPlus
        title="证券组成"
        isTable={true}
        extra={[
          <span key="currentDay">{`数据最新日期: ${stockDate || ''}`}</span>,
          <Button
            key="download"
            size="small"
            type="primary"
            style={{ marginLeft: '10px' }}
            onClick={onDownload}
          >
            下载
          </Button>,
        ]}
      >
        <ProTable
          columns={bondColumns}
          request={async (params, sorter, filter) => {
            const { stockName, stockCode } = params || { stockName: '', stockCode: '' };
            const result = await queryStockInfoPageList(indexCode, { ...params, sorter, filter });
            const { map: dayMap } = result || {};
            const { currentDay } = dayMap || {};
            setStockDate(currentDay);
            setSearchStockCode(stockCode);
            setSearchStockName(stockName);
            return result;
          }}
          search={{
            filterType: 'light',
          }}
          rowKey="stockCode"
          scroll={{ x: 'max-content' }}
          size="small"
          options={false}
          pagination={{
            pageSize: 10,
          }}
        />
      </ProCardPlus>
      <ProCardPlus
        loading={coreLoading && <Spin spining />}
        layout="center"
        title={
          <>
            算法智慧描述
            <span style={{ marginLeft: '10px' }}>
              {coreFit === 0 ? <Tag color="blue">符合</Tag> : <Tag color="red">不符合</Tag>}
            </span>
          </>
        }
        extra={
          <CopyToClipboard onCopy={onCopy} text={coreList.join('\r\n')}>
            <Button size="small" type="primary">
              复制文本
            </Button>
          </CopyToClipboard>
        }
      >
        <ul
          style={{
            border: '1px solid #DDD',
            padding: '10px 10px',
          }}
        >
          {coreList.map((str: string) => (
            <li>
              <span
                dangerouslySetInnerHTML={{
                  __html: str
                    .replaceAll('{', '<span style="color:red;">')
                    .replaceAll('}', '</span>')
                    .replaceAll('#', '<br />'),
                }}
              />
            </li>
          ))}
        </ul>
      </ProCardPlus>
    </ProCard>
  );
};

export default IndexDetail;
