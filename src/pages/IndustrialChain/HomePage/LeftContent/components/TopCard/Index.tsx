import ProCardPlus from '@/components/ProCardPlus';
import { Tabs } from 'antd';
import Review from './Review/Index';

const { TabPane } = Tabs;

// 盘前盘中和复盘
const TopCard = () => {
  return (
    <ProCardPlus title="AI盯盘">
      <Tabs defaultActiveKey="3">
        <TabPane tab="盘前观测" key="1">
          盘前观测
        </TabPane>
        <TabPane tab="盘中盯盘" key="2">
          盘中盯盘
        </TabPane>
        <TabPane tab="复盘总结" key="3">
          <Review />
        </TabPane>
      </Tabs>
    </ProCardPlus>
  );
};

TopCard.isProCard = true;

export default TopCard;
