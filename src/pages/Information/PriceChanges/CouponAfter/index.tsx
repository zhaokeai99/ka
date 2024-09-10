import React, { useEffect, useReducer } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { Row, Col } from 'antd';
import { useParams } from 'umi';
import CouponTabLayout from './components/CouponTabLayout';
import styles from './index.less';
import {
  CouponAfterTabsKeys,
  CouponAfterContext,
  ICommonActionType,
  ICommonStateType,
  ICloseEventModalParams,
} from './data.d';
import Closing from './Closing';
import Relative from './Relative';
import Valuation from './Valuation';
import EventDetailModal from './components/EventDetailModal';
import BondBaseInfoCard from './components/BondBaseInfoCard';
import PositionDetailTable from './components/PositionDetailTable';
import { getEventType } from './service';
import useAuth from '@/components/Hooks/useAuth';
import RepayInfoTable from './components/RepayInfoTable';

const tabsOption = {
  [CouponAfterTabsKeys.CLOSE]: '收盘价格异动',
  [CouponAfterTabsKeys.RELATIVE]: '相对估值偏离',
  [CouponAfterTabsKeys.VALUATION]: '估值异动',
};

const useCommonReducer = () => {
  const initValue: ICommonStateType = {
    record: {},
    visible: false,
    title: '',
  };
  const reducer = (state: ICommonStateType, action: ICommonActionType) => {
    switch (action.type) {
      case 'OPEN':
        return {
          ...state,
          ...action?.payload,
        };
      case 'CLOSE':
        return {
          ...state,
          ...initValue,
        };
      case 'EVENT-ENUM':
        return {
          ...state,
          valueEnum: action?.payload?.valueEnum,
        };
      default:
        return {
          ...state,
        };
    }
  };
  const [state, disptach] = useReducer(reducer, initValue);

  return {
    ...state,
    disptach,
  };
};

// TODO
const CouponAfter: React.FC & { isProCard: boolean } = () => {
  const { record, title, visible, valueEnum, disptach } = useCommonReducer();
  const hasAuth = useAuth({ sn: '_information_priceChanges__Module___couponAfter' });

  const params = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      const { data } = await getEventType();
      const vEnum = {};
      data?.forEach((v: any) => {
        vEnum[v.name] = {
          text: v.name,
        };
      });
      disptach({
        type: 'EVENT-ENUM',
        payload: {
          valueEnum: vEnum,
        },
      });
    })();
  }, []);

  const onOpenEventModal = (parmas: ICloseEventModalParams) => {
    disptach({
      type: 'OPEN',
      payload: {
        ...parmas,
      },
    });
  };

  const onCloseEventModal = () => {
    disptach({
      type: 'CLOSE',
    });
  };

  return (
    <CouponAfterContext.Provider
      value={{
        valueEnum,
        onOpen: onOpenEventModal,
        bondCode: params?.id,
      }}
    >
      <ProCard
        ghost
        size="small"
        style={{ padding: contentPadding }}
        className={styles['coupon-after']}
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
            <ProCard size="small" style={{ padding: 0 }} bodyStyle={{ padding: 0 }}>
              <CouponTabLayout
                options={{
                  defaultActiveKey: CouponAfterTabsKeys.CLOSE,
                  type: 'card',
                  destroyInactiveTabPane: true,
                  className: styles['coupon-tab'],
                }}
              >
                <Closing title={tabsOption.close} value={CouponAfterTabsKeys.CLOSE} />
                <Relative title={tabsOption.relative} value={CouponAfterTabsKeys.RELATIVE} />
                <Valuation title={tabsOption.valuation} value={CouponAfterTabsKeys.VALUATION} />
              </CouponTabLayout>
            </ProCard>
          </Col>
        </Row>
      </ProCard>
      <EventDetailModal
        title={title}
        visible={visible}
        onClose={onCloseEventModal}
        record={record}
      />
    </CouponAfterContext.Provider>
  );
};

CouponAfter.isProCard = true;

export default CouponAfter;
