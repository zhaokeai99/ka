import ProCardPlus from '@/components/ProCardPlus';
import { negativeColor, positiveColor } from '@/themes/index';
import { GUTTER_SIZE } from '@/utils/utils';
import { TinyArea, TinyColumn } from '@ant-design/charts';
import { InfoCircleOutlined } from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-card';
import { Space, Tooltip } from 'antd';
import { isEqual as _isEqual } from 'lodash';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import { queryStatisticCardInfo } from '../../service';
import { industryName } from '../../config';
import styles from './index.less';

const { Statistic } = StatisticCard;
const valueStyle: any = {
  fontWeight: '500',
  padding: '6px 12px',
  whiteSpace: 'nowrap',
};
const cardTips = {
  thETFCount: '',
  allETFCount:
    '全市场ETF，只包含A股市场所有ETF，不包含港股与台股ETF，并且不包含A股市场货币类型ETF，只包含股票，债券，商品类型ETF',
  thScale: '',
  allScale:
    '全市场ETF规模，只包含A股市场所有ETF，不包含港股与台股ETF，并且不包含A股市场货币类型ETF，只包含股票，债券，商品类型ETF',
  allShare:
    '全市场ETF份额，只包含A股市场所有ETF，不包含港股与台股ETF，并且不包含A股市场货币类型ETF，只包含股票，债券，商品类型ETF',
  allDealPeriodChange:
    '全市场累计成交，只包含A股市场所有ETF，不包含港股与台股ETF，并且不包含A股市场货币类型ETF，只包含股票，债券，商品类型ETF',
};

const MyTinyColumn: React.FC<any> = memo(
  (config) => {
    return <TinyColumn {...config} />;
  },
  (pre, next) => {
    return _isEqual(pre?.data, next?.data);
  },
);

const MyTinyArea: React.FC<any> = memo(
  (config) => {
    return <TinyArea {...config} />;
  },
  (pre, next) => {
    return _isEqual(pre?.data, next?.data);
  },
);

const ScaleStatistic: React.FC<{ value: number; title: string }> = memo(({ value, title }) => {
  const isPositiveNum = value >= 0;
  return (
    <Statistic
      title={title}
      trend={isPositiveNum ? 'up' : 'down'}
      value={`${value || '0'}%`}
      valueStyle={{
        color: isPositiveNum ? positiveColor : negativeColor,
        whiteSpace: 'nowrap',
      }}
    />
  );
});

const CardContainer: React.FC<{ fundType?: any }> = ({}) => {
  const [cardInfo, setCardInfo] = useState<any>({});
  const [chartData, setChartData] = useState<any[any]>({
    // 全市场今年发布走势
    allFundRelease: {},
    // 全市场份额走势
    allFundShare: {},
    // 全市场累计成交走势
    cumulativeDeal: {},
    // 天弘今年发布走势
    thFundRelease: {},
  });
  const { dateInfo, fetchDateInfo } = useModel('useIndexFundMainPageModal');

  const handleChartData = useCallback((arr) => {
    return {
      date: arr.map((i) => moment(i.businessDate).format('YYYY-MM-DD')),
      data: arr.map((i) => i.businessData),
    };
  }, []);

  useEffect(() => {
    (async () => {
      const data = await queryStatisticCardInfo({
        businessDate: dateInfo?.changeDate,
        industryName,
      });
      // 设置卡片的信息
      setCardInfo(data);
      // 由于业务日期可选 并且接口返回日期是固定的 加个判断
      if (!dateInfo?.date) fetchDateInfo(data?.businessDate);
      // 设置卡片的走势图数据
      setChartData({
        allFundRelease: handleChartData(data?.allFundReleaseTrend || []),
        allFundShare: handleChartData(data?.allFundShareTrend || []),
        cumulativeDeal: handleChartData(data?.cumulativeDealTrend || []),
        thFundRelease: handleChartData(data?.thFundReleaseTrend || []),
      });
    })();
  }, [dateInfo?.changeDate]);

  const cardTitle = useCallback(
    (title: any, tips: any) => (
      <div className={styles['statistic-header']}>
        <span className={styles['title']}>{title}</span>
        {tips ? (
          <Tooltip
            placement="top"
            title={
              <>
                {(tips || '').split(',')?.map((item: any, index: number) => (
                  <div key={index} style={{ fontSize: '10px' }}>
                    {item}
                  </div>
                ))}
              </>
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        ) : null}
      </div>
    ),
    [],
  );
  const handleConfig: any = useCallback(
    (dateList: any) => ({
      autoFit: true,
      columnWidthRatio: 0.3,
      color: '#A1C1FE',
      tooltip: {
        customContent: (_: any, data: any) => {
          const index = parseInt(_);
          const date = dateList[index];
          return (
            <div style={{ padding: '6px' }}>
              {date}：{Number(data[0]?.data?.y).toLocaleString()}亿
            </div>
          );
        },
      },
    }),
    [],
  );

  const handleAreaConfig = useCallback(
    (dateList) => ({
      autoFit: true,
      smooth: true,
      // areaStyle: { fill: 'l(270) 0:#ffffff 0.5:#eef4fe 1:#d8e5fe' },
      areaStyle: { fill: '#d8e5fe' },
      line: { color: '#3277FC' },
      tooltip: {
        customContent: (_: any, data: any) => {
          const index = parseInt(_);
          const date = dateList[index];
          return (
            <div style={{ padding: '6px' }}>
              {date}：{Number(data[0]?.data?.y).toLocaleString()}只
            </div>
          );
        },
      },
    }),
    [],
  );

  const annotations = useMemo(
    () => [
      {
        type: 'line',
        start: ['0', '0'],
        end: ['end', '0'],
        offsetX: -10,
      },
    ],
    [],
  );

  const renderCharts = useCallback((data: any, type: any = 'column', showLine: any = false) => {
    return (
      <div className={styles['chart-style']}>
        {type === 'column' ? (
          <MyTinyColumn
            {...handleConfig(data.date)}
            data={data.data || []}
            annotation={showLine ? annotations : []}
          />
        ) : (
          <MyTinyArea {...handleAreaConfig(data.date)} data={data.data || []} />
        )}
      </div>
    );
  }, []);

  return (
    <ProCardPlus ghost direction="row" gutter={[GUTTER_SIZE, 0]}>
      <StatisticCard
        colSpan="16.667%"
        ghost
        style={{ backgroundColor: '#fff' }}
        className={styles['card-style']}
        statistic={{
          title: cardTitle('天弘ETF数量', cardTips.thETFCount),
          value: `${cardInfo?.thFundCount || 0} 只`,
          valueStyle,
        }}
        chart={useMemo(
          () => renderCharts(chartData?.thFundRelease, 'area'),
          [chartData.thFundRelease],
        )}
      >
        <Statistic
          className={styles['card-footer']}
          value={cardInfo?.thFundRelease || 0}
          title="今年发布"
          suffix="只"
          layout="inline"
        />
      </StatisticCard>
      <StatisticCard
        colSpan="16.667%"
        ghost
        style={{ backgroundColor: '#fff' }}
        className={styles['card-style']}
        statistic={{
          title: cardTitle('全市场ETF数量', cardTips.allETFCount),
          value: `${cardInfo?.allFundCount || 0} 只`,
          valueStyle,
        }}
        chart={useMemo(
          () => renderCharts(chartData?.allFundRelease, 'area'),
          [chartData.allFundRelease],
        )}
      >
        <Statistic
          className={styles['card-footer']}
          value={cardInfo?.allFundRelease || 0}
          title="今年发布"
          suffix="只"
          layout="inline"
        />
      </StatisticCard>
      <StatisticCard
        colSpan="16.667%"
        ghost
        style={{ backgroundColor: '#fff' }}
        className={styles['card-style']}
        statistic={{
          title: cardTitle('天弘ETF最新规模', cardTips.thScale),
          value: `${cardInfo?.thFundScale || 0} 亿`,
          valueStyle,
          description: (
            <Space direction="vertical" size={0} style={{ padding: '8px 12px 0' }}>
              <ScaleStatistic title="周同比" value={cardInfo?.thFundScaleWeekRatio} />
              <ScaleStatistic title="日环比" value={cardInfo?.thFundScaleDayRatio} />
            </Space>
          ),
        }}
      >
        <Statistic
          className={styles['card-footer']}
          valueStyle={{
            color: cardInfo?.thFundScalePeriodChange >= 0 ? positiveColor : negativeColor,
          }}
          value={cardInfo?.thFundScalePeriodChange || 0}
          title="较上期变化"
          suffix="亿"
          layout="inline"
        />
      </StatisticCard>
      <StatisticCard
        colSpan="16.667%"
        ghost
        style={{ backgroundColor: '#fff' }}
        className={styles['card-style']}
        statistic={{
          title: cardTitle('全市场ETF规模', cardTips.allScale),
          value: `${cardInfo?.allFundScale || 0} 亿`,
          valueStyle,
          description: (
            <Space direction="vertical" size={0} style={{ padding: '8px 12px 0' }}>
              <ScaleStatistic title="周同比" value={cardInfo?.allFundScaleWeekRatio} />
              <ScaleStatistic title="日环比" value={cardInfo?.allFundScaleDayRatio} />
            </Space>
          ),
        }}
      >
        <Statistic
          className={styles['card-footer']}
          valueStyle={{
            color: cardInfo?.allFundScalePeriodChange >= 0 ? positiveColor : negativeColor,
          }}
          value={cardInfo?.allFundScalePeriodChange || 0}
          title="较上期变化"
          suffix="亿"
          layout="inline"
        />
      </StatisticCard>
      <StatisticCard
        colSpan="16.667%"
        ghost
        style={{ backgroundColor: '#fff' }}
        className={styles['card-style']}
        statistic={{
          title: cardTitle('全市场ETF份额', cardTips.allShare),
          value: `${cardInfo?.allFundShare || 0} 亿份`,
          valueStyle,
        }}
        chart={useMemo(
          () => renderCharts(chartData?.allFundShare, 'column'),
          [chartData.allFundShare],
        )}
      >
        <Statistic
          className={styles['card-footer']}
          valueStyle={{
            color: cardInfo?.allFundSharePeriodChange >= 0 ? positiveColor : negativeColor,
          }}
          value={cardInfo?.allFundSharePeriodChange || 0}
          title="较上期变化"
          suffix="万份"
          layout="inline"
        />
      </StatisticCard>
      <StatisticCard
        colSpan="16.667%"
        ghost
        style={{ backgroundColor: '#fff' }}
        className={styles['card-style']}
        statistic={{
          title: cardTitle('全市场累计成交', cardTips.allDealPeriodChange),
          value: `${cardInfo?.cumulativeDeal || 0} 亿`,
          valueStyle,
        }}
        chart={useMemo(
          () => renderCharts(chartData?.cumulativeDeal, 'column'),
          [chartData.cumulativeDeal],
        )}
      >
        <Statistic
          className={styles['card-footer']}
          valueStyle={{
            color: cardInfo?.cumulativeDealPeriodChange >= 0 ? positiveColor : negativeColor,
          }}
          value={cardInfo?.cumulativeDealPeriodChange || 0}
          title="较上期变化"
          suffix="亿"
          layout="inline"
        />
      </StatisticCard>
    </ProCardPlus>
  );
};

export default CardContainer;
