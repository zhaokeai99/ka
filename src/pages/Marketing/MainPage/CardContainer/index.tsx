import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useHistory } from 'umi';
import { Tooltip } from 'antd';
import styles from './index.less';
import { StatisticCard } from '@ant-design/pro-card';
import { TinyColumn, TinyArea } from '@ant-design/charts';
import { queryCardInfo, cardTips, queryAppIndicators } from '../service';
import useProState from '@/components/Hooks/useProState';
import { useInterval } from '@/components/thfund-front-component/src';
import { Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { dealNumThousands, GUTTER_SIZE } from '@/utils/utils';
import { negativeColor, positiveColor } from '@/themes/index';
import moment from 'moment';
import ProCardPlus from '@/components/ProCardPlus';
import { isEqual as _isEqual } from 'lodash';

const { Statistic } = StatisticCard;

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

const CardContainer: React.FC<{ fundType?: any }> = ({ fundType = '' }) => {
  const [cardInfo, setCardInfo] = useState<any>({});
  const [list, setList] = useProState<any>({});
  const [initCardData, setInitCardData] = useState<any[]>([]);
  const [appInfo, setAppInfo] = useState<any>({});
  const [startInterval, stopInterval] = useInterval();
  const valueStyle: any = {
    fontWeight: '500',
    padding: '6px 12px',
  };
  const history = useHistory();

  const queryAppInfo = useCallback(
    async (fd?: any) => {
      const data = await queryAppIndicators({ fundType: fd || fundType });
      if (data && data.dayRegisterUserCnt && data.dayAuthUserCnt) {
        setAppInfo(data);
      }
    },
    [appInfo, fundType],
  );

  useEffect(() => {
    (async () => {
      const res = await queryCardInfo({ ...(fundType ? { fundType } : {}) });
      setCardInfo(res[0]);
      setInitCardData(res[1]);
      const obj = {
        profitAmt: [],
        profitCumCnt: [],
        purchaseAmt: [],
        purchaseCnt: [],
        redeemAmt: [],
        redeemCnt: [],
      };
      res[1]?.map((item: any) => {
        for (const key in item) {
          if (obj[key]) {
            obj[key].push(item[key]);
          }
        }
      });
      setList(obj);
    })();
  }, [fundType]);

  useEffect(() => {
    const unlisten = history.listen((location) => {
      const { pathname } = location;
      if (pathname && pathname === '/marketing/app/marketing/mainPage') {
        startInterval(() => queryAppInfo(fundType), 10 * 1000, true);
      } else {
        stopInterval(queryAppInfo);
      }
    });

    return () => {
      unlisten();
    };
  }, [history, fundType]);

  useEffect(() => {
    startInterval(queryAppInfo, 10 * 1000, true);

    return () => {
      stopInterval(queryAppInfo);
    };
  }, [fundType]);

  const config: any = useMemo(
    () => ({
      autoFit: true,
      columnWidthRatio: 0.3,
      color: '#A1C1FE',
      tooltip: {
        customContent: (_: any, data: any) => {
          const index = parseInt(_);
          const date = initCardData[index]?.natureDate;
          return (
            <div style={{ padding: '6px' }}>
              {date}：{Number(data[0]?.data?.y).toLocaleString()}万
            </div>
          );
        },
      },
    }),
    [list, initCardData],
  );

  const areaConfig = useMemo(
    () => ({
      autoFit: true,
      smooth: true,
      areaStyle: { fill: 'l(270) 0:#ffffff 0.5:#eef4fe 1:#d8e5fe' },
      line: { color: '#3277FC' },
      tooltip: {
        customContent: (_: any, data: any) => {
          const index = parseInt(_);
          const date = initCardData[index]?.natureDate;
          return (
            <div style={{ padding: '6px' }}>
              {date}：{Number(data[0]?.data?.y).toLocaleString()}万
            </div>
          );
        },
      },
    }),
    [list, initCardData],
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

  const checkValue = useCallback((val: any) => {
    return val?.startsWith('-');
  }, []);

  const renderCharts = useCallback(
    (data: any, type: any = 'column', showLine: any = false) => {
      return (
        <div className={styles['chart-style']}>
          {type === 'column' ? (
            <MyTinyColumn {...config} data={data || []} annotation={showLine ? annotations : []} />
          ) : (
            <MyTinyArea {...areaConfig} data={data || []} />
          )}
        </div>
      );
    },
    [initCardData],
  );

  const cardTitle = useCallback(
    (title: any, tips: any) => (
      <div className={styles['statistic-header']}>
        <span className={styles['title']}>{title}</span>
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
      </div>
    ),
    [],
  );

  return (
    <ProCardPlus ghost gutter={[GUTTER_SIZE, 0]}>
      <ProCardPlus
        ghost
        className={styles['card-container']}
        headerBordered
        headStyle={{ height: '50px', padding: '0 24px' }}
        title="APP实时数据"
        extra={
          <Tooltip
            placement="top"
            title={`APP用户节点统计(注册、鉴权、交易)\nAPP用户交易统计(申购、赎回)`}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        colSpan="28%"
        style={{ height: '100%', backgroundColor: '#fff' }}
      >
        <div className={styles['content']}>
          <div className={styles['time']}>{moment().format('YYYY-MM-DD HH:mm')}</div>
          <div className={styles['content-item']}>
            当日注册用户
            <span className={styles['amount-style']}>{appInfo?.dayRegisterUserCnt || '--'}</span>位
          </div>
          <div className={styles['content-item']}>
            当日鉴权用户
            <span className={styles['amount-style']}>{appInfo?.dayAuthUserCnt || '--'}</span>位
          </div>
          <div className={styles['content-item']}>
            当日交易用户
            <span className={styles['amount-style']}>{appInfo?.dayTradeUserCnt || '--'}</span>位
          </div>
          <div className={styles['line']} />
          <div className={styles['content-item']}>
            申购用户/金额
            <span>
              {appInfo?.dayPurchaseUserCnt || '--'}位 /{' '}
              {dealNumThousands(appInfo?.dayPurchaseAmt || '--')}
            </span>
            万
          </div>
          <div className={styles['content-item']}>
            赎回用户/份额
            <span>
              {appInfo?.dayRedeemUserCnt || '--'}位 /{' '}
              {dealNumThousands(appInfo?.dayRedeemVolSum || '--')}
            </span>
            万份
          </div>
        </div>
      </ProCardPlus>
      <ProCardPlus direction="column" ghost colSpan="72%" gutter={[0, GUTTER_SIZE]}>
        <ProCardPlus ghost direction="row" gutter={[GUTTER_SIZE, 0]}>
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('今年以来申购金额', cardTips.purchaseAmt),
              value: `${cardInfo?.accumPurchaseAmt || 0} 亿`,
              valueStyle,
              description: (
                <Space style={{ padding: '0 12px' }}>
                  <Statistic
                    title="周同比"
                    value={cardInfo?.purchaseAmtWeekRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.purchaseAmtWeekRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                  <Statistic
                    title="日环比"
                    value={cardInfo?.purchaseAmtDayRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.purchaseAmtDayRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                </Space>
              ),
            }}
            chart={useMemo(() => renderCharts(list.purchaseAmt, 'area'), [list.purchaseAmt])}
          />
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('今年以来赎回金额', cardTips.redeemAmt),
              value: `${cardInfo?.accumRedeemAmt || 0} 亿`,
              valueStyle,
              description: (
                <Space style={{ padding: '0 12px' }}>
                  <Statistic
                    title="周同比"
                    value={cardInfo?.redeemAmtWeekRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.redeemAmtWeekRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                  <Statistic
                    title="日环比"
                    value={cardInfo?.redeemAmtDayRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.redeemAmtDayRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                </Space>
              ),
            }}
            chart={useMemo(() => renderCharts(list.redeemAmt, 'area'), [list.redeemAmt])}
          />
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('今年以来累计收益', cardTips.profitAmt),
              value: `${cardInfo?.accumProfitAmt || 0} 亿`,
              valueStyle,
              description: (
                <Space style={{ padding: '0 12px' }}>
                  <Statistic
                    title="周同比"
                    value={cardInfo?.profitAmtWeekRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.profitAmtWeekRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                  <Statistic
                    title="日环比"
                    value={cardInfo?.profitAmtDayRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.profitAmtDayRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                </Space>
              ),
            }}
            chart={useMemo(() => renderCharts(list.profitAmt, 'column', true), [list.profitAmt])}
          />
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('资产总规模', cardTips.stockAmt),
              value: `${cardInfo?.stockAmt || 0} 亿`,
              valueStyle,
              description: (
                <Statistic
                  title="日均总规模变动（亿）"
                  value={cardInfo?.averageStockAmtInr}
                  valueStyle={{ color: '#333' }}
                  style={{ padding: '0 12px' }}
                />
              ),
            }}
          />
        </ProCardPlus>
        <ProCardPlus ghost direction="row" gutter={[GUTTER_SIZE, 0]}>
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('今年以来申购笔数', cardTips.purchaseCnt),
              value: `${cardInfo?.accumPurchaseCnt || 0} 万`,
              valueStyle,
              description: (
                <Statistic
                  style={{ padding: '0 12px' }}
                  title="日均申购笔数（万）"
                  value={cardInfo?.averagePurchaseCnt}
                  valueStyle={{ color: '#333' }}
                />
              ),
            }}
            chart={useMemo(
              () => renderCharts(list.purchaseCnt, 'column', false),
              [list.purchaseCnt],
            )}
          />
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('今年以来赎回笔数', cardTips.redeemCnt),
              value: `${cardInfo?.accumRedeemCnt || 0} 万`,
              valueStyle,
              description: (
                <Statistic
                  style={{ padding: '0 12px' }}
                  title="日均赎回笔数（万）"
                  value={cardInfo?.averageRedeemCnt}
                  valueStyle={{ color: '#333' }}
                />
              ),
            }}
            chart={useMemo(() => renderCharts(list.redeemCnt, 'column', false), [list.redeemCnt])}
          />
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('今年以来盈利客户数', cardTips.profitCumCnt),
              value: `${cardInfo?.accumProfitCumCnt || 0} 万`,
              valueStyle,
              description: (
                <Space style={{ padding: '0 12px' }}>
                  <Statistic
                    title="周同比"
                    value={cardInfo?.profitCumCntWeekRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.profitCumCntWeekRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                  <Statistic
                    title="日环比"
                    value={cardInfo?.profitCumCntDayRadio}
                    valueStyle={{
                      color: checkValue(cardInfo?.profitCumCntDayRadio)
                        ? negativeColor
                        : positiveColor,
                    }}
                  />
                </Space>
              ),
            }}
          />
          <StatisticCard
            colSpan="25%"
            ghost
            style={{ backgroundColor: '#fff' }}
            className={styles['card-style']}
            statistic={{
              title: cardTitle('累计服务客户数', cardTips.purchaseCumCnt),
              value: `${cardInfo?.accumServiceCumCnt || 0} 万`,
              valueStyle,
            }}
          />
        </ProCardPlus>
      </ProCardPlus>
    </ProCardPlus>
  );
};

export default CardContainer;
