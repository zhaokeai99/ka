import React from 'react';
import { Tabs, Spin } from 'antd';
import ColumnCharts from '../ColumnCharts';
import LineCharts from '../LineCharts';

const { TabPane } = Tabs;

interface propsType {
  rankLoading: boolean;
  scoreLoading: boolean;
  scoreData: any[];
  rankData: any[];
  columnTitle: string;
}

const TabsContent = (props: propsType) => {
  const { columnTitle, rankLoading, rankData, scoreData, scoreLoading } = props;

  return (
    <div className="tabs-content">
      <Tabs size="small" defaultActiveKey="rank">
        <TabPane tab={`${columnTitle}评分排名`} key="rank">
          <Spin spinning={rankLoading}>
            <ColumnCharts data={rankData} />
          </Spin>
        </TabPane>
        <TabPane tab={`历史${columnTitle}因子评分`} key="score">
          <Spin spinning={scoreLoading}>
            <LineCharts data={scoreData} />
          </Spin>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabsContent;
