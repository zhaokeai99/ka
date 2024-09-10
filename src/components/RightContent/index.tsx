import React, { useState } from 'react';
import { Tag, Space } from 'antd';
import { Link, useModel, SelectLang } from 'umi';
import { menuTreeToArray } from '@/utils/utils';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
  mock: 'blue',
};

const GlobalHeaderRight: React.FC<any> = (props) => {
  const { initialState } = useModel('@@initialState');
  const [options] = useState(() => {
    // 获取所有非隐藏的叶子结点
    const menus = menuTreeToArray(props?.menuList || [], [], null, true, true);
    return (menus || []).map(({ path, name, isUrl }) => {
      // 外跳
      if (isUrl) {
        return {
          label: (
            <a
              target="_blank"
              href={path}
              style={{ display: 'block', width: '100%' }}
              rel="noopener noreferrer"
            >
              {name}
            </a>
          ),
          value: name,
        };
      }

      // 内部
      return {
        label: (
          <Link style={{ display: 'block', width: '100%' }} to={path}>
            {name}
          </Link>
        ),
        value: name,
      };
    });
  });

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        options={options}
      />
      <Avatar showGuide={props && props.showGuide} />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
