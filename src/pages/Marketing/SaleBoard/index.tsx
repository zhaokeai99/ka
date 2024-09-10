import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ThTabs from '@/components/ThTabs';
import FundBasicInfo from './Fund';
import AgencyInfo from './Agency';
import BankRegionInfo from './BankRegion';
import Consumer from './Customer';
import ClientManager from './ClientManager';
import VogTarget from './VogTarget';
import DictType from './DictType';
import DictInfo from './DictInfo';

const { TabPane } = ThTabs;

const SaleBoard = () => {
  return (
    <ProCardPlus style={{ padding: '12px 12px' }} ghost gutter={[0, 8]} size="small">
      <ThTabs size="small" type="card">
        <TabPane key="FundBasicInfo" tab="产品类型配置">
          <FundBasicInfo />
        </TabPane>
        <TabPane key="AgencyInfo" tab="渠道类型配置">
          <AgencyInfo />
        </TabPane>
        <TabPane key="BankRegionInfo" tab="区域考核配置">
          <BankRegionInfo />
        </TabPane>
        <TabPane key="Consumer" tab="机构客户配置">
          <Consumer />
        </TabPane>
        <TabPane key="ClientManager" tab="客户经理配置">
          <ClientManager />
        </TabPane>
        <TabPane key="VogTarget" tab="考核目标配置">
          <VogTarget />
        </TabPane>
        <TabPane key="DictType" tab="字典类型配置">
          <DictType />
        </TabPane>
        <TabPane key="DictInfo" tab="字典项配置">
          <DictInfo />
        </TabPane>
      </ThTabs>
    </ProCardPlus>
  );
};

export default SaleBoard;
