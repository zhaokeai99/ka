import ProCard from '@ant-design/pro-card';
import { memo, useState } from 'react';
import Asset from '../Asset';
import Detail from '../Detail';
import Earn from '../Earn';
import EtfProcess from '../EtfProcess';
import FileCabinet from '../FileCabinet';
import Open from '../Open';
import Position from '../Position';
import Procedure from '../Procedure';
import RiskAssess from '../RiskAssess';
import SalesProduct from '../SalesProduct';

function InternalData({ fundId, fundCode, isEtf }: any) {
  const [activeTabKey, setActiveTabKey] = useState('tab1');

  return (
    <ProCard
      ghost
      tabs={{
        type: 'card',
        tabPosition: 'top',
        activeKey: activeTabKey,
        onChange: (key) => setActiveTabKey(key),
      }}
    >
      <ProCard.TabPane key="tab1" tab="产品详情" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <Detail fundId={fundId} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab10" tab="销售详情" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <SalesProduct fundCode={fundCode ? fundCode?.split('.')[0] : ''} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab2" tab="产品文件柜" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <FileCabinet fundId={fundId} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab3" tab="产品流程" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <Procedure fundId={fundId} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab4" tab="资产信息" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <Asset fundId={fundId} fundCode={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab5" tab="持仓信息" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <Position fundId={fundId} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab6" tab="收益信息" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <Earn fundId={fundId} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab7" tab="风险评估" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <RiskAssess fundId={fundCode} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab8" tab="开放安排" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
        <Open fundId={fundId} />
      </ProCard.TabPane>
      {isEtf && (
        <ProCard.TabPane key="tab9" tab="ETF流程" cardProps={{ bodyStyle: { paddingTop: 0 } }}>
          <EtfProcess fundId={fundCode ? fundCode?.split('.')[0] : ''} />
        </ProCard.TabPane>
      )}
    </ProCard>
  );
}

export default memo(InternalData);
