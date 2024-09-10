import React, { useState, memo, useEffect } from 'react';
import { history } from 'umi';
// import _ from 'lodash';
// import AssistPanel from './AssistPanel';
// import ConfigMenus from '../../../config/mainMenu';
const ConfigMenus = {}; // todo 一旦启用这个左侧menu，替换成上边的引入就行

import styles from './index.less';

/* eslint-disable */

// 和用户拥有菜单权限比较，标识全量菜单的可使用性
const checkAuthority = (authorMap, allMenu) => {
  if (!authorMap || Object.keys(authorMap).length === 0 || !allMenu) {
    return allMenu;
  }
  if (!allMenu.children || allMenu.children.length <= 0) {
    allMenu.hasPriv = !!authorMap[allMenu.path];
    return;
  }

  for (let i = 0; i < allMenu.children.length; i++) {
    if (allMenu.children[i]) {
      checkAuthority(authorMap, allMenu.children[i]);
    }
  }
  return allMenu;
};

// 列表转换成map，方便查找
const convertListToMap = (list) => {
  const pathMap = {};
  if (!list || list.length <= 0) {
    return pathMap;
  }
  list.forEach((item) => {
    if (item && item.url) {
      pathMap[item.url] = item;
    }
  });
  return pathMap;
};

const NewMenu: React.FC<null> = (props) => {
  // const { initialState } = useModel('@@initialState');
  const [allMenus, setAllMenus] = useState(ConfigMenus);
  const [selectItem, setSelectItem] = useState({});

  if (consoleLogOpen) {
    console.log('NewMenu allMenus ', allMenus);
  }
  // 幌到了哪个左边栏菜单
  // const [currentLeft, setCurrentLeft] = useState('');
  // // const [dataForAssist, setDataForAssist] = useState([]);

  // const [currentPanelData, setCurrentPanelData] = useState([]);

  useEffect(() => {
    // 这里首次做一下权限标识 todo 拉取一个数据列表，递归比较树种元素
    // const { moduleVOS } = initialState || {};
    // if (moduleVOS && moduleVOS.length > 0) {
    //   const newMenu = checkAuthority(convertListToMap(moduleVOS), _.cloneDeep(allMenus));
    //   if (consoleLogOpen) {
    //     console.log('after checkAuthority, newMenu ', newMenu);
    //   }
    //   setAllMenus(newMenu);
    // }
  }, []);

  return (
    <div className={styles['menu-panel']}>
      {allMenus &&
        allMenus.children &&
        allMenus.children.map((item) => (
          <div
            className={styles[`menu-item${selectItem.path === item.path ? '-select' : ''}`]}
            onClick={() => {
              setSelectItem(item);
              if (item.isUrl) {
                // 外跳地址
                // window.open(item.path); // 全地址 http://
              } else {
                history.push(item.path);
              }
              if (item.children && item.children.length) {
                props.onChange && props.onChange(item.children);
              }
            }}
          >
            {item.name}
          </div>
        ))}

      {/* <AssistPanel data={dataForAssist} /> */}
    </div>
  );
};
/* eslint-disable */
export default memo(NewMenu);
