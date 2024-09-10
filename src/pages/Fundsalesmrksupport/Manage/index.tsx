import ProCardPlus from '@/components/ProCardPlus';
import { useState } from 'react';
import AgencyManager from './Agency';
import DepartmentManager from './Department';
import DivisionManager from './Division';
import DivisionConfigManager from './DivisionConfig';
import SeasonManager from './Seasons';
import SubbranchManager from './Subbranch';
import NetBranchManager from './NetBranch';
import CopyRulesManager from './CopyRules';
import PrizeConfigManager from './PrizeConfig';
import MaterialsManager from './Materials';
import CommonProductPool from './CommonProductPool';
import DivisionProductPool from './DivisionProductPool';
import UserInfoManager from './UserInfo';
import ThTabs from '@/components/ThTabs';
const { TabPane } = ThTabs;

// 理财师后台管理入口
const CopyWriter = () => {
  const [tab, setTab] = useState('DivisionManager');

  return (
    <ProCardPlus
      sn="_marketing_fundsalesmrksupport"
      style={{ padding: '12px 12px' }}
      ghost
      gutter={[0, 8]}
      size="small"
    >
      <ThTabs size="small" activeKey={tab} type="card" onChange={(key: any) => setTab(key)}>
        <TabPane key="DivisionManager" tab="赛区">
          <DivisionManager />
        </TabPane>
        <TabPane key="DivisionConfigManager" tab="赛区配置">
          <DivisionConfigManager />
        </TabPane>
        <TabPane key="SeasonManager" tab="赛季">
          <SeasonManager />
        </TabPane>
        <TabPane key="AgencyManager" tab="银行机构">
          <AgencyManager />
        </TabPane>
        <TabPane key="DepartmentManager" tab="分行">
          <DepartmentManager />
        </TabPane>
        <TabPane key="SubbranchManager" tab="支行">
          <SubbranchManager />
        </TabPane>
        <TabPane key="NetBranchManager" tab="网点">
          <NetBranchManager />
        </TabPane>
        <TabPane key="MaterialsManager" tab="物料管理">
          <MaterialsManager />
        </TabPane>
        <TabPane key="CopyRulesManager" tab="文案管理">
          <CopyRulesManager />
        </TabPane>
        <TabPane key="PrizeConfigManager" tab="开奖管理">
          <PrizeConfigManager />
        </TabPane>
        <TabPane key="CommonProdyctPool" tab="公共产品池">
          <CommonProductPool />
        </TabPane>
        <TabPane key="DivisionProductPool" tab="赛区产品池">
          <DivisionProductPool />
        </TabPane>
        <TabPane key="UserInfoManager" tab="用户信息">
          <UserInfoManager />
        </TabPane>
      </ThTabs>
    </ProCardPlus>
  );
};

export default CopyWriter;
