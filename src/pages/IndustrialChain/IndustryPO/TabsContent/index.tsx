import React from 'react';
import { Tabs } from 'antd';
import PreliminaryResults from '../Chartsanalyse';
import ChartPopularity from '../ChartPopularity';
import styles from './index.less';

const { TabPane } = Tabs;

interface propsType {
  barData: [];
  lineData: [];
  total: number;
}

const TabsContent = (props: propsType) => {
  return (
    <div className={styles['tabs-content']}>
      <Tabs
        size="small"
        defaultActiveKey="emotion"
        tabBarExtraContent={
          <span className={styles['total-tag']}>共有{props?.total ?? 0}条搜索结果</span>
        }
      >
        <TabPane tab="情绪" key="emotion">
          <PreliminaryResults data={props?.barData} />
        </TabPane>
        <TabPane tab="热度" key="popularity">
          <ChartPopularity data={props?.lineData} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabsContent;
