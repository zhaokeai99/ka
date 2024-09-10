import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import styles from './index.less';

const RiseFallPlate = ({ data = {}, type = 'up' }: any) => {
  const isUp = type === 'up';
  const fontCol = styles[isUp ? 'upCol' : 'downClo'];
  const {
    todayDailyLimitNum,
    yesDailyLimitNum,
    thanDailyLimit,
    todayDropLimitNum,
    yesDropLimitNum,
    thanDropLimit,
  } = data;

  const todayData = isUp ? todayDailyLimitNum : todayDropLimitNum;
  const yesData = isUp ? yesDailyLimitNum : yesDropLimitNum;
  const dataThan = +todayData > +yesData;
  const iconCol = styles[dataThan ? 'upCol' : 'downClo'];

  return (
    <div
      className={styles['rise-fall-plate-box']}
      style={{ borderRight: isUp ? '1px solid #e0dddd' : 'none' }}
    >
      <p className={fontCol}>{isUp ? '涨停板' : '跌停板'}</p>
      <div className={styles['rise-fall-plate-detail']}>
        <div>
          <div>
            <b className={fontCol}>{todayData}</b>支
          </div>
          <div>今</div>
        </div>
        <div>
          <div>
            <span>{yesData}</span>支
          </div>
          <div>昨</div>
        </div>
        <div>
          <div className={iconCol}>
            {dataThan ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {isUp ? thanDailyLimit ?? '-' : thanDropLimit ?? '-'}%
          </div>
          <div>比</div>
        </div>
      </div>
    </div>
  );
};

export default RiseFallPlate;
