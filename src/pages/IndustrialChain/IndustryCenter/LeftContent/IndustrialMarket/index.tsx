import ProCardPlus from '@/components/ProCardPlus';
import { useContext, useEffect, useState } from 'react';
import styles from './index.less';
// import StockLine from './StockLine';
import { IndustryProvider, queryOneChainTrendDailyData } from '../../service';
import Candlestick from './Candlestick';

const IndustrialMarket = () => {
  const { industryName } = useContext(IndustryProvider);
  const [dailyData, setDailyData] = useState<any>({});

  const checkColor = (val: any) => (`${val}`?.startsWith('-') ? '#48A366' : '#A33135');

  useEffect(() => {
    (async () => {
      const result = await queryOneChainTrendDailyData({ industryName });
      setDailyData(result);
    })();
  }, []);

  return (
    <ProCardPlus title="产业链行情">
      <div className={styles['info-container']}>
        <div className={styles['num-item']}>
          <span
            className={styles['value']}
            style={{ color: checkColor(dailyData?.endPrice - dailyData?.yesEndPrice) }}
          >
            {dailyData?.endPrice || '--'}
          </span>
          <span style={{ color: checkColor(dailyData?.riseFall) }}>
            {dailyData?.riseFall || '--'}
          </span>
          <span style={{ color: checkColor(dailyData?.riseFallRange) }}>
            {`${dailyData?.riseFallRange || '--'}%`}
          </span>
        </div>
        <div>{dailyData?.tm || '--'}</div>
        <div className={styles['detail']}>
          <>
            开：
            <span style={{ color: checkColor(dailyData?.openPrice - dailyData?.yesEndPrice) }}>
              {dailyData?.openPrice || '--'}
            </span>
          </>
          <>
            收：
            <span style={{ color: checkColor(dailyData?.endPrice - dailyData?.yesEndPrice) }}>
              {dailyData?.endPrice || '--'}
            </span>
          </>
          <>
            高：
            <span style={{ color: checkColor(dailyData?.highestPrice - dailyData?.yesEndPrice) }}>
              {dailyData?.highestPrice || '--'}
            </span>
          </>
          <>
            低：
            <span style={{ color: checkColor(dailyData?.lowestPrice - dailyData?.yesEndPrice) }}>
              {dailyData?.lowestPrice || '--'}
            </span>
          </>
        </div>
        <div className={styles['detail']}>
          <span style={{ color: '#9a60b4' }}>MA5：{dailyData?.ma5 || '--'}</span>
          <span style={{ color: '#fc8452' }}>MA10：{dailyData?.ma10 || '--'}</span>
          <span style={{ color: '#73c0de' }}>MA20：{dailyData?.ma20 || '--'}</span>
          <span style={{ color: '#5470c6' }}>MA30：{dailyData?.ma30 || '--'}</span>
        </div>
      </div>
      {/* <StockLine /> */}
      <Candlestick />
    </ProCardPlus>
  );
};

IndustrialMarket.isProCard = true;

export default IndustrialMarket;
