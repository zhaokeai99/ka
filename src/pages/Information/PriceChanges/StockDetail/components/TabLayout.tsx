import React, { useMemo } from 'react';
import { Tabs, TabsProps } from 'antd';

interface ICouponTabLayout {
  options: TabsProps;
  children: CouponTabPaneChild | CouponTabPaneChild[];
}

interface ICouponTabLayoutChildren {
  title?: string;
  value?: string;
}

type CouponTabPaneChild = React.ReactElement<ICouponTabLayoutChildren>;

const TabLayout: React.FC<ICouponTabLayout> = ({ options, children }) => {
  const bondTabChildren = useMemo(() => {
    if (Array.isArray(children)) {
      return children;
    } else {
      return [children];
    }
  }, [children]);
  if (!children) return null;
  return (
    <Tabs size="small" {...options}>
      {React.Children.map(bondTabChildren, (child: CouponTabPaneChild) => {
        const { props } = child ?? {};
        return (
          <Tabs.TabPane key={props?.value} tab={props?.title}>
            {React.cloneElement(child, {
              ...props,
              key: props?.value,
            })}
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

export default TabLayout;
