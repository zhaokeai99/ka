import ProCardPlus from '@/components/ProCardPlus';
import { GUTTER_SIZE } from '@/utils/utils';
import { Column } from '@ant-design/charts';
import { InfoCircleOutlined, MoneyCollectFilled } from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-card';
import { Radio, Tooltip } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import BarChart from './BarChart';
import ChannelTable from './ChannelTable';
import styles from './index.less';
import Ring from './Ring';
import { queryAgencyStatistics, queryAssetsInfo } from './service';

const ChannelDistribution: React.FC = () => {
  const [{ dateInfo }, { fetchDateInfo }] = useModel('useMarketingModel');
  const [disPieData, setDisPieData] = useState([]);
  const [posPieData, setPosPieData] = useState([]);
  const [cardData, setCardData] = useState<any[]>([]);
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [agencyBasicInfo, setAgencyBasicInfo] = useState<any[]>([]);
  const [fundType, setFundType] = useState('');

  useEffect(() => {
    fetchDateInfo();
  }, []);

  // 合作伙伴资产贡献
  const queryPartenerAssetsContribution = useCallback(
    async (agencyKind = '0') => {
      const result = await queryAssetsInfo({ agencyKind, ...(fundType ? { fundType } : {}) });
      const basicInfo = [
        {
          title: '总资产（亿）',
          value: result[0]?.data?.stockAmt,
          color: 'rgb(24, 120, 253)',
        },
        {
          title: '累计收益（亿）',
          value: result[0]?.data?.accumProfitAmt,
          color: 'rgb(76, 199, 92)',
        },
        {
          title: '最新收益（亿）',
          value: result[0]?.data?.profitAmt,
          color: 'rgb(244, 118, 20)',
        },
      ];
      setAgencyBasicInfo(basicInfo);
      setAgencyData(result[0]?.data?.agencyKindVogStatisticsVOS || []);
      setBarData(result[1]);
    },
    [fundType],
  );

  useEffect(() => {
    (async () => {
      const data = await queryAgencyStatistics({ ...(fundType ? { fundType } : {}) });
      const disData: any = [];
      const posData: any = [];
      data?.typeStatisticsVOS?.map((i: any) => {
        disData.push({
          name: i.agencyKindName,
          value: i.countNum,
          proportion: i.countProportion,
        });
        posData.push({
          name: i.agencyKindName,
          value: i.stockAmt,
          proportion: i.countProportion,
          valueDetail: i.stockAmtDetail,
        });
      });
      setDisPieData(disData);
      setPosPieData(posData);
      const dataInfo = [
        { title: '今年以来申购金额', value: data?.accumPurchaseAmt, unit: '亿' },
        { title: '今年以来赎回金额', value: data?.accumRedeemAmt, unit: '亿' },
        { title: '今年以来申购笔数', value: data?.accumPurchaseCnt, unit: '万' },
        { title: '今年以来赎回笔数', value: data?.accumRedeemCnt, unit: '万' },
        { title: '今年以来盈利客户数', value: data?.accumProfitAcoCnt, unit: '万' },
        { title: '累计服务客户数', value: data?.accumServiceAcoCnt, unit: '万' },
      ];
      setCardData(dataInfo);
    })();
    queryPartenerAssetsContribution();
  }, [fundType]);

  const columnConfig: any = useMemo(
    () => ({
      data: agencyData,
      maxColumnWidth: 35,
      xField: 'fundTypeName',
      yField: 'fundTypeStockAmt',
      appendPadding: [25],
      style: {
        height: '350px',
        width: '100%',
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      yAxis: {
        tickCount: 5,
        title: {
          text: '单位:亿',
          position: 'end',
        },
      },
      tooltip: {
        formatter: (value: any) => {
          return { name: value.fundTypeName, value: `${value.fundTypeStockAmt}亿` };
        },
      },
      meta: {
        fundTypeStockAmt: { alias: 'vog规模' },
      },
      label: {
        position: 'top',
        offset: 4,
        content: (value: any) => {
          return `${value.fundTypeStockAmt}\n${value.fundTypeStockAmtProportion}%`;
        },
      },
    }),
    [agencyData],
  );

  return (
    <ProCardPlus
      className="none-select"
      ghost
      style={{ padding: '12px' }}
      direction="column"
      gutter={[0, GUTTER_SIZE]}
      size="small"
      sn="_marketing_channelDistribution"
    >
      <div className={styles['header']}>
        <div>
          <span className={styles['title']}>渠道分布</span>
          <Radio.Group
            onChange={(val: any) => setFundType(val.target.value)}
            size="middle"
            defaultValue=""
            buttonStyle="solid"
          >
            <Radio.Button value="">全部类型</Radio.Button>
            <Radio.Button value="0">股票型</Radio.Button>
            <Radio.Button value="1">混合型</Radio.Button>
            <Radio.Button value="2">债券型</Radio.Button>
            <Radio.Button value="4">指数型</Radio.Button>
            <Radio.Button value="6">FOF型</Radio.Button>
            <Radio.Button value="7">ETF型</Radio.Button>
          </Radio.Group>
        </div>
        <span className={styles['deal-date']}>统计时间: {dateInfo?.dLastT1Day}</span>
      </div>
      <ProCardPlus ghost direction="row" gutter={[GUTTER_SIZE, 0]}>
        {cardData?.map((item: any, index: number) => (
          <StatisticCard
            ghost
            key={index}
            colSpan={4}
            statistic={{
              title: <div className={styles['small-card']}>{item.title}</div>,
              value: `${item.value || '--'} ${item.unit}`,
              valueStyle: { padding: '16px 12px' },
              style: {
                backgroundColor: '#fff',
                borderRadius: '4px',
              },
            }}
          />
        ))}
      </ProCardPlus>
      <ProCardPlus ghost direction="row" gutter={[GUTTER_SIZE, 0]}>
        <ProCardPlus
          style={{ minHeight: '300px' }}
          title="时点合作伙伴分布"
          extra={
            <Tooltip placement="top" title="非货公募基金的合作伙伴数">
              <InfoCircleOutlined />
            </Tooltip>
          }
        >
          <Ring data={disPieData} unit="个" />
        </ProCardPlus>
        <ProCardPlus
          style={{ minHeight: '300px' }}
          title="合作伙伴时点持仓"
          extra={
            <Tooltip placement="left" title="合作伙伴的非货公募基金的时点持仓规模">
              <InfoCircleOutlined />
            </Tooltip>
          }
        >
          <Ring data={posPieData} unit="亿" conversion />
        </ProCardPlus>
      </ProCardPlus>
      <ProCardPlus
        title="合作伙伴资产贡献"
        direction="column"
        headerBordered
        bordered
        ghost
        style={{ backgroundColor: '#fff' }}
        extra={
          <Tooltip
            placement="left"
            title={
              <>
                <span>资产贡献度：特定类别渠道的时点持仓规模所占总持仓归摸的百分比</span>
                <br />
                <span>资产配置：特定类别渠道下，各个产品投资类型的时点持仓规模</span>
              </>
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
      >
        <Radio.Group
          buttonStyle="solid"
          style={{ margin: '20px 12px 20px auto' }}
          defaultValue="0"
          onChange={(val: any) => queryPartenerAssetsContribution(val.target.value)}
        >
          <Radio.Button value="0">银行</Radio.Button>
          <Radio.Button value="1">券商</Radio.Button>
          <Radio.Button value="3">直销</Radio.Button>
          <Radio.Button value="4">三方</Radio.Button>
          <Radio.Button value="5">期货</Radio.Button>
          <Radio.Button value="9">其他</Radio.Button>
        </Radio.Group>
        <ProCardPlus
          split="vertical"
          style={{ borderTop: '1px solid #ECECEC', minHeight: '400px' }}
        >
          <ProCardPlus split="horizontal">
            <ProCardPlus split="vertical">
              {agencyBasicInfo?.map((i: any) => (
                <StatisticCard
                  statistic={{
                    title: i.title,
                    value: i.value || '--',
                    icon: <MoneyCollectFilled style={{ fontSize: 40, color: i.color }} />,
                  }}
                />
              ))}
            </ProCardPlus>
            <StatisticCard
              ghost
              title="资产贡献度"
              chart={<BarChart data={barData} height="250px" />}
            />
          </ProCardPlus>
          <StatisticCard ghost title="资产配置" chart={<Column {...columnConfig} />} />
        </ProCardPlus>
      </ProCardPlus>

      {dateInfo && <ChannelTable dateInfo={dateInfo} fundType={fundType} />}
    </ProCardPlus>
  );
};

export default ChannelDistribution;
