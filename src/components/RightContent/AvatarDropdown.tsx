import React, { useCallback } from 'react';
import {
  LogoutOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { logout } from '@/services/service';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  showGuide: any;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    async (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        await logout();
        setInitialState({
          settings: {},
          tabLayoutType: 'multi',
          userName: '',
          userNo: '',
          moduleVOS: [],
          appPrivilegeValueVOS: [],
          aclvoList: [],
        });
        history.push('/login');
      } else if (key === 'showguide' && props.showGuide) {
        props.showGuide();
      }
    },
    [initialState, setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="showguide">
        <QuestionCircleOutlined />
        新功能导引
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} alt="avatar" icon={<UserOutlined />} />
        <span className={`${styles.name}`}>{initialState.userName}</span>
        <DownOutlined style={{ marginLeft: 8, color: 'white' }} />
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
