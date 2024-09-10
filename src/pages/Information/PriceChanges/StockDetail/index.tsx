import React, { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'umi';
import ProCard from '@ant-design/pro-card';
import { Row, Col } from 'antd';
import { cardGutter, contentPadding } from '@/themes';
import StockBaseInfoCard from './components/StockBaseInfoCard';
import PositionDetailTable from './components/PositionDetailTable';
import styles from './index.less';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import useAuth from '@/components/Hooks/useAuth';
import TabLayout from './components/TabLayout';
import {
  StockDetailTabsKeys,
  ICommonStateType,
  ICommonActionType,
  StockDetailContext,
  ICloseEventModalParams,
} from './data.d';
import MoveTrend from './MoveTrend';
import EventDetailModal from './components/EventDetailModal';
import { getEventType } from './service';

const tabsOption = {
  [StockDetailTabsKeys.MOVE]: '异动趋势',
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
      case 'SET-STOCK-TYPE':
        return {
          ...state,
          stockType: action?.payload?.stockType,
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

const StockDetail: React.FC = () => {
  const params = useParams<{ id: string; name: string }>(); //TODO
  const { record, title, visible, stockType, valueEnum, disptach } = useCommonReducer();
  const { key: tabTitleKey, setTabTitle } = useContext(TabLayoutContext);
  const hasAuth = useAuth({ sn: '_information_priceChanges__Module___stockDetail' });

  useEffect(() => {
    (async () => {
      const { data } = await getEventType({ stockCode: params?.id });
      const vEnum = {};
      data?.forEach((v: any) => {
        if (v) {
          vEnum[v] = {
            text: v,
          };
        }
      });
      disptach({
        type: 'EVENT-ENUM',
        payload: {
          valueEnum: vEnum,
        },
      });
    })();
  }, [params]);

  useEffect(() => {
    setTabTitle(tabTitleKey, `${params?.name}`);
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

  const setStockType = (type: string) => {
    disptach({
      type: 'SET-STOCK-TYPE',
      payload: {
        stockType: type,
      },
    });
  };

  return (
    <StockDetailContext.Provider
      value={{
        valueEnum,
        onOpen: onOpenEventModal,
        code: params?.id,
        stockType: stockType,
      }}
    >
      <ProCard
        ghost
        size="small"
        style={{ padding: contentPadding }}
        className={styles['stock-detail']}
      >
        <Row gutter={[0, cardGutter]}>
          <Col span={24}>
            <StockBaseInfoCard setStockType={setStockType} />
          </Col>
          {hasAuth && (
            <Col span={24}>
              <PositionDetailTable />
            </Col>
          )}
          <Col span={24}>
            <ProCard size="small" style={{ padding: 0 }} bodyStyle={{ padding: 0 }}>
              <TabLayout
                options={{
                  defaultActiveKey: StockDetailTabsKeys.MOVE,
                  type: 'card',
                  destroyInactiveTabPane: true,
                  className: styles['stock-tab'],
                }}
              >
                <MoveTrend title={tabsOption.move} value={StockDetailTabsKeys.MOVE} />
              </TabLayout>
            </ProCard>
          </Col>
        </Row>
      </ProCard>
      <EventDetailModal
        title={title}
        visible={visible}
        onClose={onCloseEventModal}
        record={record}
        stockType={stockType}
      />
    </StockDetailContext.Provider>
  );
};

export default StockDetail;
