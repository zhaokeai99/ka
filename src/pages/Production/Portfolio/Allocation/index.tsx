import React, { useState, memo } from 'react';
import { Drawer, Tabs, Row, Col } from 'antd';
import CombinationTable from './components/combinationTable';
import TrackTable from './components/trackTable';
const { TabPane } = Tabs;
interface PropsType {
  visible: boolean;
  onClose: () => void;
  record: any;
}
const Allocation: React.FC<PropsType> = (props) => {
  const { visible, onClose, record } = props;
  const [activeKey, setActiveKey] = useState<string>('1');
  const [combinationDrag, setCombinationDrag] = useState<number>(0);
  const [trackDrag, setTrackDrag] = useState<number>(0);
  return (
    <Drawer
      width={'80%'}
      title={`${record.fundName}的组合资产配置`}
      placement="right"
      onClose={() => {
        onClose();
      }}
      visible={visible}
      destroyOnClose={true}
      bodyStyle={{ padding: '0 24px' }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
      >
        <TabPane tab="模块模式" key="1">
          <Row gutter={[0, 0]}>
            <Col span={24}>
              <CombinationTable
                records={record}
                drag={combinationDrag}
                changeDrag={() => {
                  setTrackDrag(trackDrag + 1);
                }}
              />
            </Col>
            <Col span={24}>
              <TrackTable
                records={record}
                drag={trackDrag}
                changeDrag={() => {
                  setCombinationDrag(combinationDrag + 1);
                }}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="表格模式" key="2"></TabPane>
      </Tabs>
    </Drawer>
  );
};
export default memo(Allocation);
