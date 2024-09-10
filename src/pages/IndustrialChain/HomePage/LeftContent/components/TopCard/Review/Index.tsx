import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import { memo, useCallback, useEffect, useState } from 'react';
import { queryReplaySummary } from '../../../service';
import BarChart from './Bar/Index';
import styles from './index.less';
import RiseFallPlate from './RiseFallPlate/Index';

// 复盘
const Review = () => {
  const [obj, setObj] = useState({
    barChartData: [],
    successRateOfPlate: '',
    connectionRate: '',
    explosionRate: '',
  });

  const getData = useCallback(async () => {
    const result = (await queryReplaySummary()) || {};
    const { riseStockNum = 0, flatStockNum = 0, declineStockNum = 0 } = result;

    const chartData = [
      {
        stockNum: 'stockNum',
        value: +riseStockNum,
        type: '涨',
      },
      {
        stockNum: 'stockNum',
        value: +declineStockNum,
        type: '平盘',
      },
      {
        stockNum: 'stockNum',
        value: +flatStockNum,
        type: '跌',
      },
    ];

    setObj({ ...result, barChartData: chartData });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles['review-wrap']}>
      <div className={styles['rise-fall']}>
        <p>涨跌表现</p>
        <BarChart data={obj.barChartData} />
      </div>
      <div className={styles['rise-fall-plate']}>
        <RiseFallPlate type="up" data={obj} />
        <RiseFallPlate type="down" data={obj} />
      </div>
      <div className={styles['bottom-wrap']}>
        <Row justify="center" style={{ width: '100%' }}>
          <Col span={8}>
            <div className={styles['card-value']}>{47.92 || obj.successRateOfPlate} %</div>
            <div className={styles['card-label']}>
              封板成功率&nbsp;
              <Tooltip title="主力通过大单(大资金)封死涨停和跌停板的成功率,值得提醒的是，这个时候的股票是交易不了的">
                <InfoCircleFilled className={styles['card-icon']} />
              </Tooltip>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles['card-value']}>{21.21 || obj.connectionRate} %</div>
            <div className={styles['card-label']}>
              昨涨停今连板率&nbsp;
              <Tooltip title="今天继昨天跌停后继续跌停概率">
                <InfoCircleFilled className={styles['card-icon']} />
              </Tooltip>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles['card-value']}>{52.08 || obj.explosionRate} %</div>
            <div className={styles['card-label']}>
              炸板率&nbsp;
              <Tooltip title="股票涨停后打开的概率">
                <InfoCircleFilled className={styles['card-icon']} />
              </Tooltip>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default memo(Review);
