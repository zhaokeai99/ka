import { primaryColor } from '@/themes/index';
import {
  AreaChartOutlined,
  DatabaseOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  MoneyCollectOutlined,
  NodeIndexOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  SolutionOutlined,
  StockOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';

import styles from './index.less';
import { arrayToTree, getPersonalMenu } from './service';

const { SubMenu } = Menu;
const Height = window.innerHeight - 90;

const getIcon = (type) => {
  switch (type) {
    case 'my':
      return <UserOutlined style={{ color: 'white' }} />;
    case 'hot':
      return <FireOutlined style={{ color: 'white' }} />;
    case 'summary':
      return <ProfileOutlined style={{ color: 'white' }} />;
    case 'report':
      return <SolutionOutlined style={{ color: 'white' }} />;
    case 'setting':
      return <SettingOutlined style={{ color: 'white' }} />;
    case 'info':
      return <ExclamationCircleOutlined style={{ color: 'white' }} />;
    case 'area_chart':
      return <AreaChartOutlined style={{ color: 'white' }} />;
    case 'database':
      return <DatabaseOutlined style={{ color: 'white' }} />;
    case 'reconciliation':
      return <ReconciliationOutlined style={{ color: 'white' }} />;
    case 'money':
      return <MoneyCollectOutlined style={{ color: 'white' }} />;
    case 'tool':
      return <ToolOutlined style={{ color: 'white' }} />;
    case 'node':
      return <NodeIndexOutlined style={{ color: 'white' }} />;
    case 'stockResearch':
      return <StockOutlined style={{ color: 'white' }} />;
    default:
      return null;
  }
};
// 渲染树状菜单
const renderTreeMenu = (trees) => {
  if (!trees || trees.length <= 0) {
    return null;
  }

  return trees.map((tree) => {
    if (tree && tree.children && tree.children.length > 0) {
      return (
        <SubMenu key={tree.path} title={tree.name} icon={getIcon(tree.icon)}>
          {renderTreeMenu(tree.children)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={tree.path} disabled={!tree.hasPriv}>
          <div
            key={tree.name}
            className={styles[`sub-item${tree.hasPriv ? '' : '-no-priv'}`]}
            onClick={() => {
              console.log('item click ', tree.path);
              // 检查权限控制跳不跳
              if (tree.hasPriv) {
                if (tree.isUrl) {
                  // 外跳地址
                  window.open(tree.path); // 全地址 http://
                } else {
                  history.push(tree.path);
                }
              } else {
                message.warn('您暂时没有权限访问这个页面，请联系管理员！');
              }
              // setDataForAssist(tree.children ? tree.children : tree.children);
            }}
          >
            {tree.name}
          </div>
        </Menu.Item>
      );
    }
  });
};

/* eslint-disable */

const LeftMenu: React.FC<any> = (props) => {
  const [menuActivate, setMenuActivate] = useState(true);
  const [hasMenuData, setHasMenuData] = useState(true);
  const [myMenuData, setMyMenuData] = useState([]);

  useEffect(() => {
    // 获取用户身份菜单，如果在登录时就能拿到最好
    getPersonalMenu()
      .then((res) => {
        console.log('getPersonalMenu call', res);
        let myMenus = [];
        if (res && res.success && res.data && res.data.length > 0) {
          myMenus = arrayToTree(_.cloneDeep(res.data));
        }
        setMyMenuData([
          {
            name: '我的' + (myMenus.length > 0 ? '' : '(0)'),
            icon: 'my',
            children: myMenus,
          },
        ]);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleHideClick = useCallback(() => {
    setMenuActivate(false);
  }, []);

  const handleShowMenu = useCallback(() => {
    hasMenuData && setMenuActivate(true);
  }, [hasMenuData]);

  const handleMenuClick = useCallback(({ key }) => {
    history.push(key);
  }, []);

  return (
    <div
      className={styles['container']}
      onMouseEnter={() => {
        handleShowMenu();
      }}
    >
      <Menu
        onClick={handleMenuClick}
        className={styles[`menu${menuActivate ? '-active' : ''}`]}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        {renderTreeMenu(myMenuData.concat(props.data))}
      </Menu>
      {hasMenuData && (
        <div style={{ width: 24, height: Height }} onClick={() => handleHideClick()}>
          {!menuActivate && (
            <DoubleRightOutlined
              style={{ marginTop: 30, height: 35, fontSize: 16, color: primaryColor }}
            />
          )}
          {menuActivate && (
            <DoubleLeftOutlined
              style={{ marginTop: 30, height: 35, fontSize: 16, color: primaryColor }}
            />
          )}
        </div>
      )}
    </div>
  );
};
/* eslint-disable */
export default LeftMenu;
