import React from 'react';
import { Tabs } from 'antd';
import ChartItem from './ChartItem';

const { TabPane } = Tabs;

interface propsType {
  data: any;
  chain: string;
}

const TabsContent = ({ data, chain }: propsType) => {
  return (
    <Tabs size="small" defaultActiveKey="edb">
      {chain === '1' ? (
        <TabPane tab="经营指标" key="edb">
          <ChartItem data={data} type="edbData" />
        </TabPane>
      ) : null}
      <TabPane tab="财务指标" key="finance">
        <ChartItem data={data} type="financeData" />
      </TabPane>
    </Tabs>
  );
};

export default TabsContent;
