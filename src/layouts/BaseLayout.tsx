import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  RouteContextType,
  Settings,
} from '@ant-design/pro-layout';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { history, useModel, MicroAppWithMemoHistory } from 'umi';
// 牺牲点性能吧，动态icon得等刘腾
import * as allIcons from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import { message } from 'antd/lib';
import zhCN from 'antd/es/locale/zh_CN';
import ProLayout, { RouteContext, WaterMark } from '@ant-design/pro-layout';
import PageLoading from '@ant-design/pro-layout/es/PageLoading';
import ProProvider from '@ant-design/pro-provider';
import Cookies from 'js-cookie';
import { TabLayout } from '@/components/thfund-front-component/src';
import NoFoundPage from '@/pages/404';
import Footer from '@/components/Footer';
import FooterFloatMenu from '@/components/FooterFloatMenu';
import HeaderMenus from '@/components/HeaderMenus';
import RightContent from '@/components/RightContent';
import VersionGuide from '@/components/VersionGuide';
import PageGuide from '@/components/PageGuide';
import { queryFatiguePOST, putFatiguePOST } from '@/services/fundportal/fatigue';
import { valueTypeMap } from '@/utils/valueTypeMap';
import {
  menuTreeToRootPath,
  menuTreeGetFirst,
  menuWithRouteComponent,
  routeWithAuthDingId,
  menuTreeToArray,
} from '@/utils/utils';
import BaseRoutes from '../../config/routes';
import menus from '../../config/menu';
import styles from './index.less';

const datas = [
  {
    id: 'fund_index_filter_btn',
    content: '“筛选”包含八大分类，百余指标，可灵活定制查询条件',
  },
  {
    id: 'fund_index_add_column_show',
    content: '在这里调整展示列，系统提供近百个可选展示列，按需增加',
  },
  {
    id: 'fund_index_search_btn',
    content: '点击查询，快速得到筛选结果，支持下载 Excel 到本地编辑、转发',
  },
  {
    id: 'fund_index_save_btn',
    content: '常用方案一键保存，也支持修改哟～',
  },
];

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const getHasNewGuide = (route, pathname) => {
  if (route && pathname) {
    for (let i = 0; i < route.length; i++) {
      const routeItem = route[i] || {};
      if (routeItem.path === pathname) {
        // 找到了对应的path，返回一个必然有效值，张建业兜底
        return { solutionCode: routeItem.solutionCode, positionCode: routeItem.positionCode };
      }
    }
  }
  return null;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { children } = props;
  const { initialState } = useModel('@@initialState');
  const [currTopMenuPath, setCurrTopMenuPath] = useState('');
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [currentMenuPath, setCurrentMenuPath] = useState('');
  const [menuData, setMenuData] = useState<any>({
    routeList: [],
    routeFlatten: [],
    menuList: [],
    menuFirstMap: {},
    menuRootMap: {},
    menuMatchPaths: {},
    menuFlattenArray: [],
  });
  const [inLinks] = useState(history.location.query?.inLinks || ''); // 是否外链,只需要执行一次判断即可
  const [isBlock] = useState(history.location.query?.isBlock || ''); // 是否阻止所有跳转,只需要执行一次判断即可
  const valuesPre = useContext(ProProvider);
  const [isModalVisible, setModalVisible] = useState(false); // todo 这里读取疲劳度控制的值即可
  const [pageGuideVisible, setPageGuideVisible] = useState(false); // todo 这里读取疲劳度控制的值即可
  // 切路由时要，去route取是否有引导，如果有去读取疲劳度的值
  const showModal = () => {
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };

  const values = {
    ...valuesPre,
  };

  const handleHeaderMenuChange = (value: any) => {
    history.push(menuData?.menuFirstMap[value]);
  };

  const getPageDatas = () => {
    return datas;
  };

  // 首次加载
  useEffect(() => {
    // 读取疲劳度的值，确定是否显示，显示的话，上报疲劳度
    const param = {
      itemList: [
        {
          contentType: 'main',
          contentCode: 'all',
          solutionCode: 'TH_PLUS_VERSION_UPGRADE_GUIDE_SOLUTION',
        },
      ],
      channel: 'FRONT',
      secondChannel: 'FUNDPORTAL',
      userId: initialState?.userName,
    };
    queryFatiguePOST(param)
      .then((res) => {
        const { success, data } = res || {};
        if (success && data && data.itemList && data.itemList[0]) {
          if (!data.itemList[0].control) {
            setModalVisible(true);
            const upParam = {
              contentType: 'main',
              contentCode: 'all',
              positionCode: 'TH_PLUS_VERSION_UPGRADE_GUIDE',
              userAction: 'IMPRESSION',
              userId: initialState?.userName,
              channel: 'FRONT',
              secondChannel: 'FUNDPORTAL',
            };
            putFatiguePOST(upParam)
              .then((resUp) => {
                console.log('resUp', resUp);
              })
              .catch((e) => console.log(e));
          }
        }
      })
      .catch((e) => console.log(e));
  }, []);

  // 检测路由变化，是否显示页面新手引导
  useEffect(() => {
    if (menuData.menuFlattenArray.length) {
      const fatigue = getHasNewGuide(menuData.menuFlattenArray, currentMenuPath);

      if (!fatigue?.solutionCode) {
        setPageGuideVisible(false);
      } else {
        // 读取疲劳度的值，确定是否显示，显示的话，上报疲劳度
        const param = {
          itemList: [
            {
              contentType: 'main',
              contentCode: 'all',
              solutionCode: fatigue.solutionCode,
            },
          ],
          channel: 'FRONT',
          secondChannel: 'FUNDPORTAL',
          userId: initialState?.userName,
        };
        queryFatiguePOST(param)
          .then((res) => {
            const { success, data } = res || {};
            if (success && data && data.itemList && data.itemList[0]) {
              if (!data.itemList[0].control) {
                setPageGuideVisible(true);
                const upParam = {
                  contentType: 'main',
                  contentCode: 'all',
                  positionCode: fatigue.positionCode,
                  userAction: 'IMPRESSION',
                  userId: initialState?.userName,
                  channel: 'FRONT',
                  secondChannel: 'FUNDPORTAL',
                };
                putFatiguePOST(upParam)
                  .then((resUp) => {
                    console.log('resUp', resUp);
                  })
                  .catch((e) => console.log(e));
              }
            }
          })
          .catch((e) => console.log(e));
      }
    }
  }, [currentMenuPath, menuData.menuFlattenArray, initialState?.userName]);

  useEffect(() => {
    // 如果被iframe嵌入，或者作为share的情况，屏蔽所有跳转
    if (isBlock === 'true') {
      props?.history?.block(() => {
        message.warning(
          `当前环境不允许跳转，如果想要使用更多功能，请您移步: ${location.origin}`,
          5,
        );
        return false;
      });
    }

    return () => {
      // 恢复跳转
      props?.history?.block(() => true);
    };
  }, []);

  // 菜单初始化配置
  useEffect(() => {
    (async () => {
      setLoadingMenu(true);
      const result: any = await new Promise((resolve) => resolve(menus));
      const RoutesList = BaseRoutes.find((r) => r.path === '/');
      const routes = RoutesList?.routes || [];

      setMenuData({
        routeList: menuWithRouteComponent(result, routes || []),
        routeFlatten: routeWithAuthDingId(result, routes),
        menuList: result || [],
        menuRootMap: menuTreeToRootPath(result || []),
        menuFirstMap: menuTreeGetFirst(result || []),
        menuFlattenArray: menuTreeToArray(result, [], null, false, true),
      });
      setLoadingMenu(false);
    })();
  }, []);

  if (inLinks === 'true') {
    return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
  }

  // 确保未加载完不继续ProLayout渲染
  // 退出登录等待服务端跳转过程中加载loading页面
  // 确保浏览器直接输入未匹配路径，加载404
  if (!menuData?.menuList?.length) return <PageLoading />;
  else if (history?.location?.pathname === '/login') return <PageLoading />;
  else if (currentMenuPath === 'NO_MATCH') return <NoFoundPage canBack />;

  return (
    <WaterMark content={`天弘基金 ${initialState?.userName || ''}`}>
      <ProLayout
        layout="mix"
        title="门户"
        fixedHeader
        logo={'hongplus.png'}
        {...initialState}
        {...props}
        route={{
          routes: menuData.routeList,
        }}
        navTheme="light"
        headerContentRender={() => (
          <HeaderMenus
            menus={menus}
            activeMenuPath={currTopMenuPath}
            onChange={handleHeaderMenuChange}
          />
        )}
        rightContentRender={() => (
          <RightContent showGuide={showModal} menuList={menuData.menuList} />
        )}
        className={styles['page-wrap']}
        postMenuData={() =>
          menuData.menuList
            .find((m) => m?.path === currTopMenuPath)
            ?.children?.filter((i: any) => !i.hideInMenu)
            ?.map((i: any) => ({
              ...i,
              ...(i.icon && allIcons[i.icon] && { icon: React.createElement(allIcons[i.icon]) }),
            })) || []
        }
        menu={{
          locale: false,
          loading: loadingMenu,
        }}
        menuItemRender={(menuItemProps, defaultDom) => {
          return (
            <div
              // style={{ marginLeft: 8, marginRight: 8 }}
              onClick={() => {
                if (menuItemProps.isUrl) {
                  // 外跳地址
                  window.open(menuItemProps.path); // 全地址 https://
                } else {
                  history.push(menuItemProps.path);
                }
              }}
            >
              {defaultDom}
            </div>
          );
        }}
      >
        <ProProvider.Provider
          value={{
            ...values,
            valueTypeMap,
          }}
        >
          <RouteContext.Consumer>
            {(value: RouteContextType) => {
              // 反向定位菜单的核心代码
              const { matchMenuKeys, currentMenu } = value || {};
              const matchMenuKey = matchMenuKeys?.[0] || '';
              setCurrTopMenuPath(menuData.menuRootMap[matchMenuKey] || '');
              setCurrentMenuPath(currentMenu?.path || 'NO_MATCH');

              return (
                <TabLayout
                  stickyType="relative"
                  footerRender={<Footer />}
                  history={history}
                  microAppWithMemoHistory={
                    <MicroAppWithMemoHistory
                      baseCookie={Cookies.get('thsso_access_authorization')}
                    />
                  }
                  routeContext={createContext({
                    ...value,
                  })}
                  type={initialState?.tabLayoutType || 'mix'}
                >
                  {children}
                </TabLayout>
              );
            }}
          </RouteContext.Consumer>
        </ProProvider.Provider>
        {Array.isArray(footerMenuConfig) && footerMenuConfig.length && (
          <FooterFloatMenu
            setPageGuideVisible={setPageGuideVisible}
            route={menuData.routeFlatten}
            currentPath={currentMenuPath}
          />
        )}
        {isModalVisible && <VersionGuide isModalVisible={isModalVisible} hideModal={hideModal} />}
        {pageGuideVisible && (
          <PageGuide
            visible={pageGuideVisible}
            setVisible={setPageGuideVisible}
            datas={getPageDatas()}
          />
        )}
      </ProLayout>
    </WaterMark>
  );
};

export default BasicLayout;
