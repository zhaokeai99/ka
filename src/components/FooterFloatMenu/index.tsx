import React, { useEffect, useState, useCallback } from 'react';
import { history } from 'umi';

import styles from './index.less';

const getConsultId = (route, pathname) => {
  if (route && pathname) {
    for (let i = 0; i < route.length; i++) {
      const routeItem = route[i] || {};
      if (routeItem.path === pathname) {
        // 找到了对应的path，返回一个必然有效值，张建业兜底
        return routeItem.authDingId || 'ytfjcr5';
      }
    }
  }
  return null;
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

const LeftMenu: React.FC<any> = (props = {}) => {
  const { route, setPageGuideVisible, currentPath } = props;
  const [menuActivate, setMenuActivate] = useState(false);
  const [consultId, setConsultId] = useState('ytfjcr5'); // 默认张建业
  const [showGuideBtn, setShowGuideBtn] = useState(false);

  const handleShowMenu = useCallback((show) => {
    setMenuActivate(show);
  }, []);

  useEffect(() => {
    // 根据pathname查找对应的owner
    const newConsultId = getConsultId(route, currentPath);
    setConsultId(newConsultId || 'ytfjcr5');
    const fatigue = getHasNewGuide(route, currentPath);
    setShowGuideBtn(!!fatigue?.solutionCode);
  }, [currentPath, route]);

  // todo 订阅还没接口

  return (
    <div
      className={styles['container']}
      onMouseEnter={() => {
        handleShowMenu(true);
      }}
      onMouseLeave={() => {
        handleShowMenu(false);
      }}
    >
      <div className={styles[`area${menuActivate ? '-active' : ''}`]}>
        {footerMenuConfig && footerMenuConfig.indexOf('back') > -1 && (
          <div
            title="返回上一个页面"
            className={styles['icon-back']}
            onClick={() => history.goBack()}
          ></div>
        )}
        {footerMenuConfig && footerMenuConfig.indexOf('subcribe') > -1 && (
          <div title="订阅该页面" className={styles['icon-subscribe']}></div>
        )}
        {footerMenuConfig && footerMenuConfig.indexOf('consult') > -1 && (
          <a
            title="咨询页面负责人"
            href={'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=' + consultId}
            className={styles['icon-consult']}
          ></a>
        )}
        {showGuideBtn && (
          <div
            title="查看页面引导"
            className={styles['icon-newguide']}
            onClick={() => {
              if (setPageGuideVisible) {
                setPageGuideVisible(true);
              }
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default LeftMenu;
