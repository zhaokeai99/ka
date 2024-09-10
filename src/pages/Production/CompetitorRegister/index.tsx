import { GUTTER_SIZE } from '@/utils/utils';
import ProCard from '@ant-design/pro-card';
import { Tabs } from 'antd';
import React from 'react';
import ApproveSpeedTable from './components/ApproveSpeedTable';
import DataArea from './components/DataArea';
import DataChart from './components/DataChart';
import DataTable from './components/DataTable';
import StatisticTable from './components/StatisticTable';

const { TabPane } = Tabs;

const CompetitorRegister: React.FC = () => {
  return (
    <ProCard style={{ padding: '12px 12px' }} direction="column" ghost gutter={[0, GUTTER_SIZE]}>
      <DataArea />
      <DataChart />
      <ProCard ghost style={{ backgroundColor: '#ffffff', padding: '0 12px' }}>
        <Tabs>
          <TabPane key="detailInfo" tab="详细信息">
            <DataTable />
          </TabPane>
          <TabPane key="statistics" tab="统计信息">
            <StatisticTable />
          </TabPane>
          <TabPane key="approveSpeed" tab="审批速度">
            <ApproveSpeedTable />
          </TabPane>
        </Tabs>
      </ProCard>
    </ProCard>
  );
};

export default CompetitorRegister;
