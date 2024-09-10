import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { contentPadding } from '@/themes';
import ProCardPlus from '@/components/ProCardPlus';
import SearchTree from './SearchTree';
import StockChart from './StockChart';
import ResearchTrends from './ResearchTrends';
import { Layout } from 'antd';
import { IrReportFacadeAuthUserManage } from '@/pages/Investment/StockResearch/AlphaView/service';
import TopForm from './top';
import NoPermissionPage from '@/components/NoPermissionPage';
import moment from 'moment';

const { Content, Sider } = Layout;

const AlphaView = () => {
  const [selectTreeParams, setSelectTreeParams] = useState<any>({
    level: undefined,
    children: undefined,
    bizType: 3,
    stockCode: 'Label',
  }); // 选中树参数

  const [loading, setLoading] = useState<boolean>(true);
  const [pass, setPass] = useState<boolean | undefined>(undefined);
  const [userAccount, setUserAccount] = useState<string>('all');
  const [clientHeight, setClientHeight] = useState<number>(document.body.clientHeight);
  const [treeBeginDate, setTreeBeginDate] = useState<string>(
    moment().subtract(7, 'days').format('YYYY-MM-DD'),
  );
  const [showMode, setShowMode] = useState<boolean>(false);

  const [collapsed, setCollapsed] = useState(false);

  const ref = useRef<any>(null);
  const ResarchFormRef = useRef();
  const TreeFormRef = useRef();
  // 监听resize
  useEffect(() => {
    function onResize() {
      const h = document.body.clientHeight;
      setClientHeight(h);
      ref.current.parentElement.style.height = h - 78 + 'px';
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onSelect = useCallback(
    (val: any) => {
      const { options } = val;
      const { stockCode, stockName, level, children, bizType } = options?.node;
      setSelectTreeParams({ stockCode, stockName, level, children, bizType, userAccount });
    },
    [selectTreeParams],
  );

  const authUser = async () => {
    setLoading(true);
    const data = await IrReportFacadeAuthUserManage({ menu: 'ALPHA' });
    setPass(data);
    setLoading(false);
  };

  const clearBottom = () => {
    ref.current.parentElement.getElementsByTagName('footer')[0].remove();
    // ref.current.parentElement.removeChild()
  };

  useEffect(() => {
    // 验证权限
    authUser();
    clearBottom();
  }, []);

  const getAuthFail = () => {
    return <NoPermissionPage />;
  };

  const userSelect = useCallback(
    (uAccount: any) => {
      setUserAccount(uAccount);
      // onSelect('')
      setSelectTreeParams({
        stockCode: 'Label',
        bizType: 3,
        stockName: undefined,
        level: null,
        children: undefined,
        userAccount: uAccount,
      });
    },
    [selectTreeParams],
  );
  //图表指定查询
  const chartMarkClick = (obj: any) => {
    // @ts-ignore
    ResarchFormRef?.current?.searchById(obj);
  };

  const treeTrigger = () => {
    setCollapsed(!collapsed);
  };

  //变更开始日期
  const changeBeginDate = (value: any) => {
    setTreeBeginDate(value);
  };
  //设置树查询全部
  const handleTreeAll = (val: any) => {
    if (val) {
      TreeFormRef?.current?.setAll();
    }
  };

  // 显示模式切换
  const showModeHandle = (value: any) => {
    setClientHeight(document.body.clientHeight);
    setShowMode(value);
  };

  return (
    <div ref={ref} className={'testDiv'}>
      {pass !== undefined && pass === false ? (
        getAuthFail()
      ) : (
        <>
          <ProCardPlus
            ghost
            style={{
              paddingLeft: contentPadding,
              paddingTop: contentPadding,
              paddingRight: contentPadding,
            }}
            split={'horizontal'}
            size="small"
            loading={loading}
          >
            <TopForm onSelect={userSelect} showMode={showMode} />
          </ProCardPlus>
          <ProCardPlus
            ghost
            style={{ padding: contentPadding }}
            split={'horizontal'}
            size="small"
            loading={loading}
          >
            <Layout
              style={{
                minHeight: showMode ? 'calc(100vh - 255px)' : 'calc(100vh - 199px)',
                maxHeight: showMode ? 'calc(100vh - 255px)' : 'calc(100vh - 199px)',
              }}
            >
              <Sider
                style={collapsed ? {} : { margin: '0 12px 0 0' }}
                theme="light"
                collapsible
                trigger={null}
                collapsedWidth={0}
                width={234}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
              >
                <SearchTree
                  cRef={TreeFormRef}
                  colSpan="15%"
                  onSelect={onSelect}
                  userAccount={userAccount}
                  show={!collapsed}
                  onTrigger={treeTrigger}
                  clientHeight={showMode ? clientHeight - 254 : clientHeight - 199}
                  beginDate={treeBeginDate}
                />
              </Sider>
              <Layout className="site-layout">
                <Content>
                  <ProCardPlus
                    ghost
                    size="small"
                    direction="column"
                    bodyStyle={{
                      height: showMode ? clientHeight - 254 : clientHeight - 199,
                      overflowY: 'auto',
                    }}
                  >
                    <div id={'div_alphaview_ir_main_top'}></div>
                    {selectTreeParams?.bizType === 1 || selectTreeParams?.bizType === 2 ? (
                      <>
                        <StockChart
                          params={selectTreeParams}
                          onMarkClick={chartMarkClick}
                          setCollapsend={setCollapsed}
                          showCollapsed={collapsed}
                        />
                      </>
                    ) : (
                      ''
                    )}
                    <ResearchTrends
                      showMode={showModeHandle}
                      setCollapsend={setCollapsed}
                      showCollapsed={
                        !(selectTreeParams?.bizType === 1 || selectTreeParams?.bizType === 2) &&
                        collapsed
                      }
                      params={selectTreeParams}
                      userAccount={userAccount}
                      cRef={ResarchFormRef}
                      onChangeBeginDate={changeBeginDate}
                      onHandleTreeAll={handleTreeAll}
                    />
                  </ProCardPlus>
                </Content>
              </Layout>
            </Layout>
          </ProCardPlus>
        </>
      )}
    </div>
  );
};
export default memo(AlphaView);
