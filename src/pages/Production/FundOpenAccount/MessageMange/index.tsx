import React, { useEffect, useState, useMemo } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import EditableTable from './compontents/EditableTable';
import { Tabs, Spin } from 'antd';
import columnsMapFn from './columns';
import { queryAcctTypeReference } from './service';

const { TabPane } = Tabs;

const keyList = [
  {
    tabText: '管理人',
    key: 'MANAGER',
  },
  {
    tabText: '管理人经办人',
    key: 'MANAGEROPERATOR',
  },
  {
    tabText: '托管人',
    key: 'TRUSTEE',
  },
  {
    tabText: '托管人经办人',
    key: 'TRUSTEEOPERATOR',
  },
  {
    tabText: '联系人信息',
    key: 'LINK',
  },
  {
    tabText: '基金经理/投资经理',
    key: 'FUNDMANAGER',
  },
  {
    tabText: '邮寄地址',
    key: 'EMAILADDRESS',
  },
];

const MessageMange: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({});
  const columnsMap = useMemo(() => columnsMapFn(data), [data]);

  const getDataFn = async () => {
    setLoading(true);
    const options = await queryAcctTypeReference();
    setData(options);
    setLoading(false);
  };

  useEffect(() => {
    getDataFn();
  }, []);

  return (
    <ProCardPlus ghost style={{ padding: '12px' }} sn="_production_businessManage__messageManage">
      <Spin spinning={loading} delay={300}>
        <Tabs size="small" tabBarStyle={{ background: '#fff', margin: '0', padding: '0 16px' }}>
          {keyList.map((item: any) => {
            return (
              <TabPane tab={item.tabText} key={item.key}>
                <EditableTable tabKey={item.key} partColumns={columnsMap[item.key]} />
              </TabPane>
            );
          })}
        </Tabs>
      </Spin>
    </ProCardPlus>
  );
};

export default MessageMange;
