import ProCardPlus from '@/components/ProCardPlus';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Icons from './icons';
import { IrReportFacadeQueryIrUserInfo } from './service';
import style from './index.less';

type PropsType = {
  onSelect: (val: any) => void;
  showMode: boolean;
};
const { TabPane } = Tabs;

const SearchTree = (props: PropsType) => {
  const { onSelect, showMode } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<any>([]);

  const loadUser = async () => {
    const params = {
      role: 'invest',
    };
    setLoading(true);
    const data = await IrReportFacadeQueryIrUserInfo(params);
    setUserInfo(data);
    setLoading(false);
  };

  const tabChange = (e: any) => {
    onSelect(e);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const getBannerStyle = () => {
    if (showMode) {
      return style['top-banner'];
    } else {
      return [style['top-banner'], style['top-banner-abbr']].join(' ');
    }
  };

  return (
    <div className={getBannerStyle()}>
      <ProCardPlus
        loading={loading}
        size="small"
        style={{ padding: '5px 12px' }}
        bodyStyle={{ padding: '12px 5px' }}
      >
        <Tabs
          popupClassName={showMode ? 'popup-more-tabs' : 'popup-abbr-more-tabs'}
          defaultActiveKey="1"
          tabBarStyle={{ height: showMode ? 94 : 38 }}
          className={style['icon_change']}
          onChange={tabChange}
        >
          <TabPane
            tab={
              <div className={'tab-pane-panel tab-pane-panel-all'}>
                <Icons.Icons name={'全部'} showMode={showMode} />
              </div>
            }
            key="all"
          ></TabPane>
          {userInfo?.map((user: any) => {
            return (
              <TabPane
                tab={
                  <div
                    className={[
                      style['tab-panel-user-header'],
                      'tab-pane-panel',
                      'tab-pane-panel-other',
                    ].join(' ')}
                  >
                    <Icons.Icons name={user.userName} showMode={showMode} />
                  </div>
                }
                key={user.accountName}
              ></TabPane>
            );
          })}
        </Tabs>
      </ProCardPlus>
    </div>
  );
};

SearchTree.isProCard = true;

export default SearchTree;
