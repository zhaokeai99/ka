import React, { useEffect, useRef, useState } from 'react';
import { Empty, Layout } from 'antd';
import TabsComponent from '@/pages/Investment/Simulation/PortfolioManagement/Tabs/TabsComponent';
import ChartsComponent from '@/pages/Investment/Simulation/PortfolioManagement/Charts/ChartsComponent';
import PortfolioComponent from '@/pages/Investment/Simulation/PortfolioManagement/Portfolio/PortfolioComponent';
import { MpBenchmarkQuery } from '@/pages/Investment/Simulation/Benchmarks/service';
import {
  MpDomainFacadeImplQueryMpDomain,
  MpRsPortfolioFacadeGet,
  MpRsSysBaseInfoFacadeGetDateInfo,
} from './service';
import TreeComponent from './Tree/TreeComponent';
import { getUserInfo } from '@/services/service';
import ProCardPlus from '@/components/ProCardPlus';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './index.less';
import moment from 'moment';

const { Content, Sider } = Layout;

// 投资->模拟组合->组合->组合管理
const PortfolioManagement = ({ history }: any) => {
  const [data, setData] = useState<any>(undefined);
  const [dicMap, setDicMap] = useState<any>({ domain: [], benchmark: [] });
  const [checkJumpUrlParam, setCheckJumpUrlParam] = useState<any>(() => {
    const pathname = history.location.pathname;
    const paths = pathname.split('/_single_/');
    const paramStr = paths[1] || '';
    const itmSplit = paramStr.split(',');
    if (!paramStr || paramStr === ':params') return {};
    const fomtData = {
      e: [itmSplit[0]],
      jumpInfo: {
        code: itmSplit[4],
        key: itmSplit[0],
        node: {
          fatherNode: {
            title: itmSplit[3],
            key: itmSplit[2],
          },
          data: {
            id: itmSplit[1],
            domain: itmSplit[2],
            mpCode: itmSplit[4],
            mpName: itmSplit[5],
            bmCode: itmSplit[6],
            bmName: itmSplit[7],
            investPool: itmSplit[9]?.replace('&', ',')?.replace('(', '')?.replace(')', ''),
            investPoolName: itmSplit[10]?.replace('&', ',')?.replace('(', '')?.replace(')', ''),
            beginDate: itmSplit[8],
          },
        },
      },
    };
    return fomtData;
  }); // 组合收益分析页面跳转过来参数
  const [tradeDate, setTradeDate] = useState<string>(
    moment(new Date()).subtract(1, 'days').format('YYYYMMDD'),
  ); // 默认前一天
  const [maxDate, setMaxDate] = useState<string>(
    moment(new Date()).subtract(0, 'days').format('YYYYMMDD'),
  ); // 默认当天日期
  const [prevTradeDate, setPrevTradeDate] = useState<string>(
    moment(new Date()).subtract(1, 'days').format('YYYYMMDD'),
  ); // 默认前一天
  const [isNewDate, setIsNewDate] = useState<boolean>(false); // 是否为持仓最新日期
  const [newHoldItemDataInfo, setqueryNewHoldItemDataInfo] = useState<any>({
    tradeDate: '',
    positionDate: '',
    today: '',
    isNewDate: false,
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const treeRef = useRef();
  const ref = useRef<any>(null);

  const getPrevTrade = async (params: any) => {
    const result = await MpRsSysBaseInfoFacadeGetDateInfo(params);
    setqueryNewHoldItemDataInfo({ ...result });
    setTradeDate(result?.tradeDate);
    setMaxDate(result?.today);
    setPrevTradeDate(result?.tradeDate);
    setIsNewDate(result?.isNewDate);
  };

  // 加载字典
  const dicLoad = async () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { data } = await getUserInfo();
    const domainList: any[] = [];
    data?.applicationGroupVOS?.map((map: any) => {
      domainList.push(map.sn);
    });
    // 业务域
    const domainResult = await MpDomainFacadeImplQueryMpDomain({});
    const dic = { domain: [], benchmark: [] };
    if (domainResult) {
      // @ts-ignore
      dic.domain = domainResult;
    }
    // 基准
    const bmResult = await MpBenchmarkQuery({});
    if (bmResult) {
      // @ts-ignore
      dic.benchmark = bmResult;
    }
    setDicMap(dic);
  };

  const clearBottom = () => {
    ref.current.parentElement.getElementsByTagName('footer')[0].remove();
  };

  useEffect(() => {
    // 加截数据
    dicLoad();

    clearBottom();
  }, []);

  //组合树选中
  const onSelect = (keys: any[], info: any) => {
    const portInfo = info.node?.data;
    if (portInfo !== undefined) {
      setData(portInfo);
      const p = { domain: portInfo?.domain, mpCode: portInfo?.mpCode };
      getPrevTrade(p);
    }
  };

  const treeRefresh = () => {
    // @ts-ignore
    treeRef?.current?.refresh();
  };

  const refreshData = () => {
    setCheckJumpUrlParam({});
    treeRefresh();
  };
  const refreshEdit = (edit: boolean) => {
    setIsEdit(edit);
  };

  const tradeDateChange = (e: string) => {
    setTradeDate(e);
  };

  const tradeDateChangeCheckIsNewData = (b: boolean) => {
    setIsNewDate(b);
  };

  // 查组合信息
  const refreshGetPortfolioInfo = async (portfolioId: any) => {
    const resultObject = await MpRsPortfolioFacadeGet({ id: portfolioId });
    setData(resultObject);
  };

  return (
    <div ref={ref} style={{ height: '100%' }}>
      <Layout style={{ height: '100%' }}>
        <Sider
          theme="light"
          width={280}
          style={{ height: '100%' }}
          collapsedWidth={0}
          collapsible={true}
          trigger={
            collapsed ? (
              <RightOutlined className={'sider-trigger'} />
            ) : (
              <LeftOutlined className={'sider-trigger'} />
            )
          }
          onCollapse={(value) => {
            setCollapsed(value);
          }}
        >
          <TreeComponent
            onSelect={(e, i) => {
              onSelect(e, i);
            }}
            dicMap={dicMap}
            cRef={treeRef}
            isHide={collapsed}
            onRefresh={refreshData}
            checkJumpUrlParam={checkJumpUrlParam}
          />
        </Sider>
        <Layout style={{ height: '100%' }}>
          <Content style={{ margin: '0 0 0 10px' }} className={'layout-content'}>
            <ProCardPlus ghost size="small" style={{ padding: 12 }}>
              {data !== undefined ? (
                <>
                  <PortfolioComponent
                    portfolioId={data?.id}
                    onRefresh={refreshData}
                    onRefreshEdit={refreshEdit}
                    refreshGetPortfolioInfo={refreshGetPortfolioInfo}
                    dicMap={dicMap}
                    tradeDate={tradeDate}
                    maxDate={maxDate}
                    prevTradeDate={prevTradeDate}
                    isNewDate={isNewDate}
                    newHoldItemDataInfo={newHoldItemDataInfo}
                    onTradeDateChange={tradeDateChange}
                    tradeDateChangeCheckIsNewData={tradeDateChangeCheckIsNewData}
                  />
                  <TabsComponent
                    portfolioInfo={data}
                    dicMap={dicMap}
                    tradeDate={tradeDate}
                    prevTradeDate={prevTradeDate}
                    isEdit={isEdit}
                  />
                  <ChartsComponent portfolioInfo={data} dicMap={dicMap} tradeDate={tradeDate} />
                </>
              ) : (
                <Empty
                  style={{ marginTop: 60 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="请从左侧选择组合标签查看数据"
                />
              )}
            </ProCardPlus>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default PortfolioManagement;
