import ProCardPlus from '@/components/ProCardPlus';
import { Line } from '@ant-design/charts';
import { Radio } from 'antd';
import { isEqual } from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { queryAmountTrend } from '../service';
import Title from '../Title';
import styles from './index.less';

const MyLine: React.FC<any> = memo(
  (config) => {
    return <Line {...config} />;
  },
  (pre, next) => {
    return isEqual(pre?.data, next?.data);
  },
);

// 存量趋势模块
const StockTrend = () => {
  const [chartList, setChartList] = useState<any[]>([]);
  const [curValue, setCurValue] = useState('');

  // 存量趋势数据
  useEffect(() => {
    (async () => {
      const result = await queryAmountTrend({
        endDate: moment().format('YYYYMMDD'),
        dateDur: '6',
        startDate: moment().subtract(15, 'months').format('YYYYMMDD'),
        ...(curValue ? { dimension: curValue } : {}),
      });
      setChartList(result);
    })();
  }, [curValue]);

  const config = useMemo(
    () => ({
      data: chartList,
      style: {
        height: '380px',
      },
      appendPadding: 15,
      xField: 'month',
      yField: 'assetAmt',
      meta: {
        month: {
          formatter: (v: any) => `${moment(v).format('YYYY-MM')}`,
        },
        assetAmt: {
          formatter: (v: any) => `${Number(v).toLocaleString()} 亿`,
        },
      },
    }),
    [chartList],
  );

  // 全部tooltip配置
  const allTooltip = useMemo(
    () => ({
      customContent: (title: any, items: any): any => {
        return (
          <>
            <div className={styles['title']}>{title}</div>
            <ul style={{ padding: 0 }}>
              {items.map((i: any, k: number) => {
                const { data } = i;
                return (
                  <li key={k} className={styles['all-tooltip-item']}>
                    <div>
                      <label>流入:</label>
                      <span>{Number(data.buyAmt).toLocaleString()} 万</span>
                    </div>
                    <div>
                      <label>流出:</label>
                      <span>{Number(data.sellAmt).toLocaleString()} 万</span>
                    </div>
                    <div>
                      <label>净流入:</label>
                      <span>{Number(data.netBuyAmt).toLocaleString()} 万</span>
                    </div>
                    <div>
                      <label>存量规模:</label>
                      <span>{Number(data.assetAmt).toLocaleString()} 亿</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    }),
    [curValue],
  );

  // 多折线图tooltip配置
  const classifyTooltip = useMemo(
    () => ({
      customContent: (title: any, items: any): any => {
        return (
          <>
            <div className={styles['title']}>{title}</div>
            <ul style={{ padding: 0 }}>
              <li className={styles['item-content']}>
                <div className={styles['first']}>部门</div>
                <div style={{ fontWeight: '500' }}>流入</div>
                <div style={{ fontWeight: '500' }}>流出</div>
                <div style={{ fontWeight: '500' }}>净流入</div>
                <div style={{ fontWeight: '500' }}>存量规模</div>
              </li>
              {items?.map((item: any, index: number) => {
                const { data, mappingData } = item;
                return (
                  <li key={index} className={styles['item-content']}>
                    <div className={styles['first']}>
                      <div
                        style={{ backgroundColor: mappingData.color }}
                        className={styles['point']}
                      />
                      <span>{data.name}</span>
                    </div>
                    <div>{Number(data.buyAmt).toLocaleString()} 万</div>
                    <div>{Number(data.sellAmt).toLocaleString()} 万</div>
                    <div>{Number(data.netBuyAmt).toLocaleString()} 万</div>
                    <div>{Number(data.assetAmt).toLocaleString()} 亿</div>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    }),
    [curValue],
  );

  return (
    <ProCardPlus
      ghost
      direction="column"
      style={{ padding: 16, backgroundColor: '#fff', minHeight: '400px' }}
      id="stockTrend"
    >
      <Title
        title="存量趋势"
        extra={
          <Radio.Group
            onChange={(val: any) => setCurValue(val.target.value)}
            defaultValue=""
            size="middle"
          >
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="pdept_id">部门维度</Radio.Button>
            <Radio.Button value="fund_vog_type">产品维度</Radio.Button>
            {/* <Radio.Button value="3">渠道维度</Radio.Button> */}
            {/* <Radio.Button value="4">机构维度</Radio.Button> */}
          </Radio.Group>
        }
      />
      <MyLine
        seriesField={!curValue ? '' : 'name'}
        {...config}
        tooltip={!curValue ? allTooltip : classifyTooltip}
      />
    </ProCardPlus>
  );
};

StockTrend.isProCard = true;

export default StockTrend;
