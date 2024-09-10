import { SelectKeyProvider, TabProvider } from '@/pages/IndustrialChain/ChainDetail/service';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { Badge, Tabs } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { queryNodeTagAbnormalSignal } from '../service';
import { CompetitionPattern, Fund, Indicators, Listed, Notice, PublicOpinion } from './components';

const { TabPane } = Tabs;

interface tabListType {
  abnormalSignal: boolean;
  tagCode: string;
  title: string;
  key: string;
  component: any;
}

// 初始化tabs列表
const tabsList: any = [
  {
    abnormalSignal: false,
    tagCode: 'tag',
    title: '指标',
    key: 'indicators',
    component: <Indicators />,
  },
  {
    abnormalSignal: false,
    tagCode: 'listed',
    title: '上市发债公司',
    key: 'listed',
    component: <Listed />,
  },
  {
    abnormalSignal: false,
    tagCode: 'notice',
    title: '公告掘金',
    key: 'notice',
    component: <Notice />,
  },
  {
    abnormalSignal: false,
    tagCode: 'fund',
    title: '基金',
    key: 'fund',
    component: <Fund />,
  },
  {
    abnormalSignal: false,
    tagCode: 'competitionPattern',
    title: '竞争格局',
    key: 'competitionPattern',
    component: <CompetitionPattern />,
  },
  {
    abnormalSignal: false,
    tagCode: 'news',
    title: '舆情',
    key: 'publicOpinion',
    component: <PublicOpinion />,
  },
];

const RightContent = () => {
  const { selectKey }: any = useContext(SelectKeyProvider);

  const [tab, setTab] = useState('indicators');
  const [tabList, setTabList] = useState<tabListType[]>(tabsList);

  const onChange = (key: string) => setTab(key);

  const getNodeTagAbnormalSignal = async () => {
    const result = await queryNodeTagAbnormalSignal({ nodeId: selectKey?.key });

    return result || [];
  };

  const formatTabsList = (arr: [], arr2: []) => {
    const result = (arr || []).map((item: any) => {
      const res: any = arr2?.filter(({ abnormalSignal, tagCode }) => {
        return abnormalSignal && tagCode === item.tagCode;
      });

      return { ...item, ...res[0] };
    });

    return result;
  };

  useEffect(() => {
    (async () => {
      if (selectKey?.key) {
        const list: any = await getNodeTagAbnormalSignal();
        const data = formatTabsList(tabsList, list);

        setTabList(data || []);
      }
    })();
  }, [selectKey?.key]);

  return (
    <TabProvider.Provider value={{ tab }}>
      <Tabs
        size="small"
        activeKey={tab}
        onChange={onChange}
        tabBarExtraContent={
          tab === 'publicOpinion' ? (
            <a style={{ fontSize: 12 }} href="#/industrialChain/industryPO">
              更多舆情 &gt;
            </a>
          ) : null
        }
      >
        {tabList?.map(
          (item: { title: string; key: string; abnormalSignal: boolean; component: any }) => (
            <TabPane
              key={item.key}
              tab={
                <Badge color={COLORENUM?.red6} dot={item.abnormalSignal} offset={[4, 0]}>
                  {item.title}
                </Badge>
              }
            >
              {item.component}
            </TabPane>
          ),
        )}
      </Tabs>
    </TabProvider.Provider>
  );
};

export default RightContent;
