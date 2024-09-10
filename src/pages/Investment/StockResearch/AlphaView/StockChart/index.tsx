import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';
import { Button, Col, Divider, Row, Space, Spin } from 'antd';
import * as echarts from 'echarts';
import {
  DataRunFacadeGetSecurityDayDerivativeRangeNew,
  DataRunFacadeQuerySecurityDayHistoryRange,
  IrReportFacadeQueryRecommendRecord,
} from './service';
import moment from 'moment';
import lodash from 'lodash';
import { ArrowDownOutlined, ArrowUpOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

type PropsType = {
  showCollapsed: boolean;
  setCollapsend: (value: any) => void;
  params: {
    markId: any;
    stockCode: string;
    stockName: string;
    level: string;
    userAccount: string;
  };
  onMarkClick: (obj: any) => void;
};

const upColor = '#ffffff';
const upBorderColor = '#F04864';
const downColor = '#2FC15B';
const downBorderColor = '#2FC15B';
const lableColor = '#F27C49';

let tmpStockRealInfo = {
  date: '',
  open: '--',
  close: '--',
  high: '--',
  low: '--',
  volume: '--',
  ma5: '--',
  ma10: '--',
  ma20: '--',
  ma30: '--',
};

const StockChart = (props: PropsType) => {
  const { onMarkClick, showCollapsed, setCollapsend } = props;
  const ref = useRef<any>(null);
  const myChartRef = useRef<any>(null);
  const [currDate, setCurrDate] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({ categoryData: [], values: [], volumes: [] });
  const [chartOrgData, setChartOrgData] = useState<any>([]);
  const [stockInfo, setStockInfo] = useState<any>({});
  const [stockRealInfo, setStockRealInfo] = useState<any>({});
  const [stockDetailInfo, setStockDetailInfo] = useState<any>(undefined);
  const [recommendInfo, setRecommendInfo] = useState<any>([]);

  const onResize = () => {
    myChartRef.current.resize();
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const splitData = (rawData: any) => {
    const categoryData = [];
    const values = [];
    const volumes = [];
    for (let i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
      volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
    }
    return {
      categoryData: categoryData,
      values: values,
      volumes: volumes,
    };
  };

  //整理数据
  const dataHandle = (data: any[]) => {
    const resultData: any[] = [];
    if (data === undefined || data === null) {
      return resultData;
    }
    let type = 'a';
    if (data.length === 0) {
      return resultData;
    }
    if (data[0].security_type === 'index_sw') {
      type = 'sw';
    }
    if (data[0].security_type === 'index_wind') {
      type = 'wind';
    }

    if (type === 'a') {
      data.forEach((d) => {
        const tmp = [];
        tmp.push(d.trade_date);
        tmp.push(d.pre_adj_open_price);
        tmp.push(d.pre_adj_close_price);
        tmp.push(d.pre_adj_low_price);
        tmp.push(d.pre_adj_high_price);
        tmp.push(d.deal_volume ? d.deal_volume / 10000 : undefined);
        tmp.push(d.pre_adj_pre_close_price);
        resultData.push(tmp);
      });
    } else {
      data.forEach((d) => {
        const tmp = [];
        tmp.push(d.trade_date);
        tmp.push(d.open_price);
        tmp.push(d.close_price);
        tmp.push(d.low_price);
        tmp.push(d.high_price);
        tmp.push(d.deal_volume ? d.deal_volume / 10000 : undefined);
        tmp.push(d.pre_close_price);
        resultData.push(tmp);
      });
    }
    return resultData;
  };

  const onBtnCollcapsedClick = () => {
    setCollapsend(!showCollapsed);
  };

  const getCollapsendBtn = () => {
    if (showCollapsed) {
      return (
        <>
          {' '}
          <Button
            style={{ marginTop: 2 }}
            onClick={onBtnCollcapsedClick}
            className={styles['search-button']}
            icon={<MenuUnfoldOutlined />}
          />
          <Divider type={'vertical'} style={{ height: 18 }} />
        </>
      );
    }
    return undefined;
  };

  //标题
  const titleHandle = (data: any) => {
    if (data.length > 0) {
      const d = data[data.length - 1];
      setStockInfo(d);
    } else {
      setStockInfo({});
    }
  };

  //图表标签
  const recommendQuery = useCallback(
    async (params?: any) => {
      const p = {
        stockCode: params.securityWindCode,
        userName: undefined,
      };
      if (params.uAccount && params.uAccount !== 'all') {
        p.userName = params.uAccount;
      }
      const data = await IrReportFacadeQueryRecommendRecord(p);
      setRecommendInfo(data);
    },
    [recommendInfo],
  );

  const getDataZoomStart = () => {
    if (chartOrgData.length > 100) {
      const per = Math.round((100 / chartOrgData.length) * 100);
      return 100 - per;
    }
    return 0;
  };

  // 股票标签列表树
  const initChartData = useCallback(
    async (params?: any) => {
      setLoading(true);
      const data = await DataRunFacadeQuerySecurityDayHistoryRange(params);
      setChartOrgData(data);
      const handleData = dataHandle(data);
      setChartData({ ...splitData(handleData) });
      titleHandle(data);
      setLoading(false);
    },
    [chartData, stockInfo],
  );
  //
  const initStockDetailInfo = useCallback(
    async (params?: any) => {
      const data = await DataRunFacadeGetSecurityDayDerivativeRangeNew(params);
      setStockDetailInfo(data);
    },
    [stockDetailInfo],
  );

  useEffect(() => {
    if (
      props.params.stockCode === undefined ||
      props.params.stockCode === null ||
      props.params.stockCode === ''
    ) {
      return;
    }
    const params = { securityWindCode: props.params.stockCode, uAccount: props.params.userAccount };
    initChartData(params);
    recommendQuery(params);
    initStockDetailInfo(params);
  }, [props.params.stockCode]);

  const handleMarkPoint = (recommand: any[], data: any[]) => {
    const points: any[] = [];
    const dateTmp: any[] = [];
    recommand?.map((re) => {
      const date = moment(re.recommendDate).format('YYYYMMDD');
      if (lodash.indexOf(dateTmp, date) >= 0) {
        return;
      }
      let color = lableColor;
      let str = 'M';
      if (re.recommend === 1) {
        str = 'B';
        color = upBorderColor;
      } else if (re.recommend === 2) {
        str = 'S';
        color = downColor;
      }

      const d = lodash.find(data, { trade_date: date });
      if (d !== undefined) {
        const y = d.high_price;
        dateTmp.push(date);
        if (currDate && currDate === date) {
          //选中
          points.push({
            coord: [date, y, re.id, re.irMsgId],
            symbol: 'pin',
            symbolSize: 50,
            value: str,
            animation: true,
            label: {
              show: true,
            },
            itemStyle: { color },
          });
        } else {
          points.push({
            coord: [date, y, re.id, re.irMsgId],
            symbol: 'pin',
            symbolSize: 50,
            value: str,
            animation: true,
            label: {
              show: true,
              color: color,
            },
            itemStyle: { color: '#fff', borderColor: color },
          });
        }
      }
    });
    return points;
  };

  //formatter
  const handlerFormatter = useCallback(
    (params: any[]) => {
      //修改鼠标划过显示为中文
      let data = {
        date: '',
        open: '--',
        close: '--',
        high: '--',
        low: '--',
        volume: '--', //currentItemData?[5] ? (currentItemData[5] / 10000).toFixed(2) : '--',
        ma5: '--',
        ma10: '--',
        ma20: '--',
        ma30: '--',
      };

      let currentItemData: any = undefined;
      let showDate = '';
      const maList: any = [];
      params.map((p) => {
        if (p.componentSubType === 'candlestick') {
          currentItemData = p.data;
          showDate = moment(params[0].name, 'YYYYMMDD').format('YYYY-MM-DD');
        } else if (p.componentSubType === 'line') {
          maList.push(p);
        }
      });

      if (tmpStockRealInfo?.date === showDate) {
        data = tmpStockRealInfo;
      } else {
        if (currentItemData) {
          data.date = showDate;
          data.open = currentItemData[1] ? currentItemData[1].toFixed(2) : '--';
          data.close = currentItemData[2] ? currentItemData[2].toFixed(2) : '--';
          data.high = currentItemData[3] ? currentItemData[3].toFixed(2) : '--';
          data.low = currentItemData[4] ? currentItemData[4].toFixed(2) : '--';
          data.volume = currentItemData[5] ? currentItemData[5].toFixed(2) : '--';
        }
        data.ma5 = maList[0]?.data ? maList[0]?.data : '--';
        data.ma10 = maList[1]?.data ? maList[1]?.data : '--';
        data.ma20 = maList[2]?.data ? maList[2]?.data : '--';
        data.ma30 = maList[3]?.data ? maList[3]?.data : '--';

        setStockRealInfo(data);
        tmpStockRealInfo = data;
      }

      return (
        showDate +
        '<div style="width:200px"><span style="width:100px; display:inline-block">成交量:</span><span style="width:100px; text-align:right; display:inline-block">' +
        data.volume +
        '万</span></div>' +
        '<div style="width:200px"><span style="width:100px; display:inline-block"></span></div>' +
        '<div style="width:200px"><span style="width:100px; display:inline-block">开盘价:</span><span style="width:100px; text-align:right; display:inline-block">' +
        data.open +
        '</span></div>' +
        '<div style="width:200px"><span style="width:100px; display:inline-block">收盘价:</span><span style="width:100px; text-align:right; display:inline-block">' +
        data.close +
        '</span></div>' +
        '<div style="width:200px"><span style="width:100px; display:inline-block">最低价::</span><span style="width:100px; text-align:right; display:inline-block">' +
        data.high +
        '</span></div>' +
        '<div style="width:200px"><span style="width:100px; display:inline-block">最高价:</span><span style="width:100px; text-align:right; display:inline-block">' +
        data.low +
        '</span></div>'
      );
    },
    [stockRealInfo],
  );

  const markPointClick = (params: any) => {
    if (params.componentType === 'markPoint') {
      const pointData = params.data.coord;
      const ds = lodash.find(recommendInfo, { irMsgId: pointData[3] });
      const tmpDate = moment(ds.recommendDate).format('YYYYMMDD');
      if (tmpDate === currDate) {
        setCurrDate(undefined);
        onMarkClick(undefined);
      } else {
        setCurrDate(tmpDate);
        onMarkClick(ds);
      }
    }
  };

  /**
   * 初始化
   */
  const initChart = () => {
    myChartRef.current = echarts.init(ref.current);
    // @ts-ignore
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: handlerFormatter,
      },
      visualMap: {
        show: false,
        seriesIndex: 1,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: downColor,
          },
          {
            value: -1,
            color: upBorderColor,
          },
        ],
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all',
          },
        ],
        label: {
          backgroundColor: '#777',
        },
      },
      grid: [
        {
          top: '10%',
          left: '10%',
          right: '10%',
          height: '60%',
        },
        {
          left: '10%',
          right: '10%',
          top: '73%',
          height: '16%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: chartData.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100,
          },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: chartData.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
      ],
      yAxis: [
        {
          scale: true,
          axisTick: { show: false },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: getDataZoomStart(),
          end: 100,
          bottom: 5,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 5,
          start: getDataZoomStart(),
          end: 100,
        },
      ],
      series: [
        {
          name: '日K',
          type: 'candlestick',
          data: chartData.values,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: upBorderColor,
            borderColor0: downBorderColor,
          },
          markPoint: {
            data: handleMarkPoint(recommendInfo, chartOrgData),
            itemStyle: {
              color: upBorderColor,
            },
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: chartData.volumes,
        },
      ],
    };
    if (myChartRef.current) {
      myChartRef.current.setOption(option, true);
    }
    myChartRef.current.off('click');

    myChartRef.current.on('click', function (params: any) {
      markPointClick(params);
    });
  };

  useEffect(() => {
    initChart();
    setCurrDate(undefined);
  }, [chartData]);

  useEffect(() => {
    initChart();
  }, [currDate]);

  //涨跌
  const priceShow = (_stockInfo: any) => {
    let price = _stockInfo.pre_adj_close_price;
    let preClosePrice = _stockInfo.pre_adj_pre_close_price;
    if (_stockInfo.security_type?.indexOf('index') > -1) {
      price = _stockInfo.close_price;
      preClosePrice = _stockInfo.pre_close_price;
    }
    if (price === undefined || price === null) {
      return '';
    }
    let style = '',
      icon: any = '';
    if (price < preClosePrice) {
      style = 'price_down';
      icon = <ArrowDownOutlined />;
    } else if (price > preClosePrice) {
      style = 'price_up';
      icon = <ArrowUpOutlined />;
    }
    return (
      <div className={[styles['price_text'], styles[style]].join(' ')}>
        {price.toFixed(2)}
        {icon}
      </div>
    );
  };

  //币种
  const currencyShow = (_stockInfo: any) => {
    if (_stockInfo?.currency_code === undefined || _stockInfo?.currency_code === null) {
      return '';
    }
    return <div className={styles['small_text']}>{_stockInfo?.currency_code}</div>;
  };

  //涨跌
  const changePriceShow = (_stockInfo: any) => {
    let price = _stockInfo.pre_adj_close_price;
    let preClosePrice = _stockInfo.pre_adj_pre_close_price;
    if (_stockInfo.security_type?.indexOf('index') > -1) {
      price = _stockInfo.close_price;
      preClosePrice = _stockInfo.pre_close_price;
    }
    if (price === undefined || price === null) {
      return '';
    }
    let style = 'price_up';
    if (price < preClosePrice) {
      style = 'price_down';
    }
    return (
      <div className={[styles['small_text'], styles[style]].join(' ')}>
        {(price - preClosePrice).toFixed(2)}
      </div>
    );
  };

  //涨跌率
  const pctChangeShow = (_stockInfo: any) => {
    let price = _stockInfo.pre_adj_close_price;
    let preClosePrice = _stockInfo.pre_adj_pre_close_price;
    if (_stockInfo.security_type?.indexOf('index') > -1) {
      price = _stockInfo.close_price;
      preClosePrice = _stockInfo.pre_close_price;
    }
    if (price === undefined || price === null) {
      return '';
    }
    let style = 'price_up';
    if (price < preClosePrice) {
      style = 'price_down';
    }
    return (
      <div className={[styles['small_text'], styles[style]].join(' ')}>
        {(((price - preClosePrice) / preClosePrice) * 100).toFixed(2) + '%'}
      </div>
    );
  };

  const tradeDateShow = (_stockInfo: any) => {
    if (_stockInfo?.trade_date === undefined || _stockInfo?.trade_date === null) {
      return '';
    }
    const dateStr = moment(_stockInfo?.trade_date, 'YYYYMMDD').format('M月DD日');
    return <div className={styles['small_text']}>(截止{dateStr})</div>;
  };

  //图的标题
  const chartTitleShow = (_stockInfo: any, _stockRealInfo: any) => {
    let closePrice = _stockInfo.pre_adj_close_price;
    let openPrice = _stockInfo.pre_adj_open_price;
    let highPrice = _stockInfo.pre_adj_high_price;
    let lowPrice = _stockInfo.pre_adj_low_price;
    if (_stockInfo.security_type?.indexOf('index') > -1) {
      closePrice = _stockInfo.close_price;
      openPrice = _stockInfo.open_price;
      highPrice = _stockInfo.high_price;
      lowPrice = _stockInfo.low_price;
    }
    return (
      <>
        <span>
          {props.params.stockName}[{props.params.stockCode}]
        </span>
        <span>
          {_stockRealInfo.date
            ? _stockRealInfo.date
            : stockInfo?.trade_date
            ? moment(stockInfo?.trade_date, 'YYYYMMDD').format('YYYY-MM-DD')
            : ''}
        </span>
        <span>
          开：
          {_stockRealInfo.open ? _stockRealInfo.open : openPrice ? openPrice.toFixed(2) : '--'}
        </span>
        <span>
          收：
          {_stockRealInfo.close ? _stockRealInfo.close : closePrice ? closePrice.toFixed(2) : '--'}
        </span>
        <span>
          高：
          {_stockRealInfo.high ? _stockRealInfo.high : highPrice ? highPrice.toFixed(2) : '--'}
        </span>
        <span>
          低：
          {_stockRealInfo.low ? _stockRealInfo.low : lowPrice ? lowPrice.toFixed(2) : '--'}
        </span>
        <span>
          成交：
          {_stockRealInfo.volume
            ? _stockRealInfo.volume + '万'
            : stockInfo?.deal_volume
            ? (stockInfo?.deal_volume / 10000).toFixed(2) + '万'
            : '--'}
        </span>
      </>
    );
  };

  const chartMoveOut = () => {
    setStockRealInfo({});
  };

  const numCalYi = (value: any) => {
    try {
      if (value) {
        const result = value / 100000000;
        if (result > 10) {
          return (value / 100000000).toFixed(0) + '亿';
        } else {
          return (value / 100000000).toFixed(2) + '亿';
        }
      } else {
        return '--';
      }
    } catch (e) {
      console.error(e);
      return '--';
    }
  };

  const numValid = (value: any) => {
    if (value) {
      return value;
    }
    return '--';
  };

  return (
    <div className={styles['stock_chart_body']}>
      <Row>
        <Col span={24}>
          <div style={{ padding: '8px 16px 0 16px' }}>
            {getCollapsendBtn()}
            <span className={styles['stock_chart_title']}>{props.params.stockName}</span>
            <span className={styles['stock_chart_sub_title']}>{props.params.stockCode}</span>
            <span className={styles['stock_chart_sub_title']}>{props.params.level}</span>
          </div>
        </Col>
      </Row>
      <Row className={styles['stock_chart_info_bar']}>
        <Col span={24} className={styles['chart-info-div']}>
          <Space>
            {priceShow(stockInfo)}
            {currencyShow(stockInfo)}
            {changePriceShow(stockInfo)}
            {pctChangeShow(stockInfo)}
            {tradeDateShow(stockInfo)}
          </Space>
          {stockDetailInfo && stockDetailInfo !== null ? (
            <Space>
              <div className={styles['big_text']}>
                {numCalYi(stockDetailInfo?.total_market_value)}
                <br />
                总市值
              </div>
              <div className={styles['big_text']}>
                {numCalYi(stockDetailInfo?.outstanding_market_value)}
                <br />
                流通市值
              </div>
              <div className={styles['big_text']}>
                {numValid(stockDetailInfo.pe_ttm)}
                <br />
                市盈率TTM
              </div>
              <div className={styles['big_text']}>
                {numValid(stockDetailInfo.turnover) + '%'}
                <br />
                换手率
              </div>
              <div className={styles['big_text']}>
                {numCalYi(stockDetailInfo?.assets_today)}
                <br />
                净资产
              </div>
              <div className={styles['big_text']}>
                {numCalYi(stockDetailInfo?.oper_rev_ttm)}
                <br />
                营业收入
              </div>
            </Space>
          ) : (
            ''
          )}
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <div className={styles['chart-title']}>{chartTitleShow(stockInfo, stockRealInfo)}</div>
          <ProCard colSpan="70%" style={{ height: '520px', width: '100%', display: 'flex' }}>
            <Spin spinning={loading}>
              <div
                ref={ref}
                style={{ width: '100%', height: '500px', display: 'flex' }}
                onMouseOut={chartMoveOut}
              ></div>
            </Spin>
          </ProCard>
        </Col>
      </Row>
    </div>
  );
};

StockChart.isProCard = true;

export default memo(StockChart);
