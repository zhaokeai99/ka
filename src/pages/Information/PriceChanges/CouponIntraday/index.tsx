import React from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { Row, Col } from 'antd';
import BourseChart from './components/BourseChart';
import HistroyChart from './components/HistroyChart';
import BondBaseInfoCard from './components/BondBaseInfoCard';
import PositionDetailTable from './components/PositionDetailTable';
import styles from './index.less';
import useAuth from '@/components/Hooks/useAuth';
import RepayInfoTable from './components/RepayInfoTable';

const CouponIntraday: React.FC & { isProCard: boolean } = () => {
  const hasAuth = useAuth({ sn: '_information_priceChanges__Module___couponIntraday' });
  return (
    <ProCard
      ghost
      size="small"
      style={{ padding: contentPadding }}
      className={styles['coupon-intraday']}
    >
      <Row gutter={[cardGutter, cardGutter]}>
        <Col span={24}>
          <BondBaseInfoCard />
        </Col>
        {hasAuth && (
          <Col span={24}>
            <PositionDetailTable />
          </Col>
        )}
        <Col span={24}>
          <RepayInfoTable />
        </Col>
        <Col span={24}>
          <BourseChart />
        </Col>
        <Col span={24}>
          <HistroyChart />
        </Col>
      </Row>
    </ProCard>
  );
};

CouponIntraday.isProCard = true;

export default CouponIntraday;
