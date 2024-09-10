import React, { useEffect, useState } from 'react';
import { Badge, Tabs } from 'antd';
import MpHoldItemTable from './components/MpHoldItemTable';
import MpHoldChgTable from './components/MpHoldChgTable';
import MpDealTable from './components/MpDealTable';
import MpTurnOverTable from './components/MpTurnOverTable';
import styles from './index.less';
import { PortfolioInfo } from '@/pages/Investment/Simulation/PortfolioManagement/service';
import ProCardPlus from '@/components/ProCardPlus';

const { TabPane } = Tabs;

interface ModalProps {
  portfolioInfo: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
  tradeDate: string;
  prevTradeDate: string;
  isEdit: boolean;
}

const TabsComponent = (props: ModalProps) => {
  const { portfolioInfo, dicMap, tradeDate, prevTradeDate, isEdit } = props;
  const [dealState, setDealState] = useState<any>(0);
  const [turnoverState, setTurnoverState] = useState<any>(0);

  useEffect(() => {}, [tradeDate, portfolioInfo?.id]);

  const onUpdateState = (key: any, value: any) => {
    if (key === 'deal') {
      setDealState(value);
    } else if (key === 'turnover') {
      setTurnoverState(value);
    }
  };

  return (
    <ProCardPlus title={'组合详情'} bordered style={{ marginBottom: 10 }}>
      <Tabs
        defaultActiveKey="1"
        className={[styles['tabs-card'], 'tabs_style'].join(' ')}
        style={{ marginTop: -12 }}
      >
        <TabPane tab="组合持仓" key="1">
          <MpHoldItemTable portfolioInfo={portfolioInfo} dicMap={dicMap} tradeDate={tradeDate} />
        </TabPane>
        <TabPane tab="组合调整" key="2">
          <MpHoldChgTable
            portfolioInfo={portfolioInfo}
            dicMap={dicMap}
            tradeDate={tradeDate}
            prevTradeDate={prevTradeDate}
            isOkEdit={isEdit}
          />
        </TabPane>
        <TabPane
          forceRender
          tab={
            <Badge dot count={dealState} title={'有成交'}>
              成交明细
            </Badge>
          }
          key="3"
        >
          <MpDealTable
            portfolioInfo={portfolioInfo}
            dicMap={dicMap}
            tradeDate={tradeDate}
            onUpdateState={onUpdateState}
          />
        </TabPane>
        <TabPane
          forceRender
          tab={
            <Badge dot count={turnoverState} title={'有换手'}>
              组合换手
            </Badge>
          }
          key="4"
        >
          <MpTurnOverTable
            portfolioInfo={portfolioInfo}
            dicMap={dicMap}
            tradeDate={tradeDate}
            onUpdateState={onUpdateState}
          />
        </TabPane>
      </Tabs>
    </ProCardPlus>
  );
};
export default TabsComponent;
