import React from 'react';
import { Tabs } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;

const ThTabs = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <div className={styles['th-tabs-container']}>
      <Tabs {...otherProps}>{children}</Tabs>
    </div>
  );
};

ThTabs.TabPane = TabPane;

export default ThTabs;
